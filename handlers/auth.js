const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

const validate = require("../utils/validate");
const mailSender = require("../utils/mailSender");

const { Profiles } = require("../models");
const { catchError, verificationGenerator, resendVerification, differenceInHour } = require("../utils/quickFunctions");

exports.signup = async (req, res) => {
  try {
    const { password, email, name } = req.body;

    validate({ type: "handle", value: name, label: "Name", attributes: ["hasRange(3,30)"] });
    validate({ type: "email", value: email });
    validate({
      type: "password",
      value: password,
      attributes: ["hasNumber", "hasSpecialChar", "hasRange", "hasLetter"],
    });

    // check if email is taken already
    const emailTaken = await Profiles.findOne({ email });
    if (emailTaken) throw { message: "Email taken" };

    const verification = verificationGenerator(),
      hashedPassword = await bcrypt.hash(password, 10);

    const dbResponse = await Profiles.insertOne({
      name,
      email,
      stat: {
        dateCreated: new Date(),
      },
      auth: {
        role: "user",
        emailVerified: false,
        verification: {
          code: verification,
          time: new Date(),
        },
        password: hashedPassword,
        wrongAttempts: 0, // <= account locked && verification will be reset after 5 attempts
        accountLocked: false,
      },
    });

    if (dbResponse && dbResponse.insertedId) {
      const verifyLink = `/auth/signup?verification=${verification}&ref=${dbResponse.insertedId}`;

      await Profiles.updateOne(
        { _id: new ObjectId(dbResponse.insertedId), email },
        { $set: { "auth.session": `${verificationGenerator(24)}~${dbResponse.insertedId}~${verificationGenerator(24)}` } }
      );

      await mailSender({
        email,
        subject: "Email Verification",
        template: "verify",
        preheader: `Hello, ${name}! Kindly verify your email.`,
        verifyLink,
        name,
      });
    }

    res.status(200).json({ status: "success" });
  } catch (err) {
    return catchError({ res, err, message: err.message || "Unable to create account" });
  }
};

exports.finalizeSignup = async (req, res) => {
  try {
    const { verification, ref } = req.body;

    validate({ type: "alphanumeric", value: verification, label: "Verification Code", attributes: ["hasRange(256,256)", "allowDash"] });
    validate({ type: "alphanumeric", value: ref, label: "Reference", attributes: ["hasRange(24,24)"] });

    const profileData = await Profiles.findOne({ _id: new ObjectId(ref) });

    // check if profile exists and has not been verified
    if (profileData && !profileData.auth.emailVerified) {
      const {
        email,
        name,
        stat: { dateCreated },
        auth: {
          verification: { code },
        },
      } = profileData;

      if (verification === code) {
        // check if date exceeds 24 hrs
        const expiredVerification = differenceInHour(dateCreated) > 24;

        // resend new verification link
        if (expiredVerification) return await resendVerification({ email, name, ref });

        await Profiles.updateOne(
          { _id: new ObjectId(ref), "auth.verification.code": verification },
          { $set: { "auth.verification.code": false, "auth.emailVerified": true } }
        );

        await mailSender({
          email: email,
          subject: "Welcome to Atlas Search Translation",
          template: "welcome",
          preheader: `Welcome ${name}!`,
          name,
        });

        return res.status(200).json({ status: "Email Verification successful" });
      } else {
        return await resendVerification({ email, name, ref }); // <= resend new verification link
      }
    } else {
      throw { message: "Link might have expired or is invalid" };
    }
  } catch (err) {
    return catchError({ res, err, message: err.message || "Unable to finalize signup" });
  }
};

exports.signin = async (req, res) => {
  try {
    if (process.env.NODE === "production") throw { message: "Server error" };
    const { password, email } = req.body;

    validate({ type: "email", value: email });
    validate({
      type: "password",
      value: password,
      attributes: ["hasNumber", "hasSpecialChar", "hasRange", "hasLetter"],
    });

    // verify that account exist, else throw an error
    const profileData = await Profiles.findOne({ email });
    if (!profileData) throw { message: "Invalid Email/Password" };

    const {
      _id,
      name,
      auth: { password: dbPassword, wrongAttempts, accountLocked, emailVerified, session, role },
    } = profileData;

    const rightPassword = await bcrypt.compare(password, dbPassword);

    if (rightPassword) {
      // check if account has been locked for 3 hours
      const accountTempLocked = differenceInHour(accountLocked) <= 3;

      if (wrongAttempts >= 5 && accountTempLocked) throw { message: "Account is temporarily locked, Please try again later" };

      if (!emailVerified)
        return await resendVerification({
          email,
          name,
          ref: _id,
          errMsg: "Email not verified! We just sent another verification mail",
        });

      // reset wrongPassword counter
      await Profiles.updateOne({ email }, { $set: { "auth.wrongAttempts": 0 } });

      const token = jwt.sign({ session }, process.env.SECRET, { expiresIn: "120 days" });

      return res
        .cookie("token", token, {
          httpOnly: true,
          //   secure: true,
        })
        .json({ session, name, role });
    } else {
      await Profiles.updateOne(
        { email },
        {
          $inc: { "auth.wrongAttempts": 1 }, // <= increment wrong attempts
          $set: { "auth.accountLocked": new Date() }, // <= set new time to track account locked
        }
      );

      throw { message: "Invalid Email/Password" };
    }
  } catch (err) {
    return catchError({ res, err, message: err.message || "A signin error occured" });
  }
};

exports.starter = async (req, res) => {
  try {
    res.status(200).json("successful");
  } catch (err) {
    return catchError({ res, err, message: err.message || "An error occured" });
  }
};

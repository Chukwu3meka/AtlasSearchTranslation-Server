const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

const validate = require("../utils/validate");
const mailSender = require("../utils/mailSender");

const { Profiles } = require("../models");
const verifyMail = require("../source/emailTemplates/verify");
const { catchError, verificationGenerator } = require("../utils/serverFunctions");

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
    if (emailTaken) throw { label: "Email taken" };

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
        verification: {
          ref: verification,
          time: new Date(),
        },
        password: hashedPassword,
        wrongAttempts: 0, // <= account locked && verification will be reset after 5 attempts
      },
    });

    if (dbResponse && dbResponse.insertedId) {
      const verifyLink = `/auth/signup?verification=${verification}&ref=${dbResponse.insertedId}`;

      await Profiles.updateOne(
        { _id: new ObjectId(dbResponse.insertedId), email },
        { $set: { "auth.session": `${dbResponse.insertedId}${verificationGenerator(256)}` } }
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
    return catchError({ res, err, message: "Unable to create account" });
  }
};

exports.finalizeSignup = async (req, res) => {
  try {
    const { verification, ref } = req.body;

    validate({ type: "alphanumeric", value: verification, label: "Verification Code", attributes: ["hasRange(256,256)", "allowDash"] });
    validate({ type: "alphanumeric", value: ref, label: "Reference", attributes: ["hasRange(24,24)"] });

    const profileData = await Profiles.findOne({ _id: new ObjectId(ref) });

    // check if profile exists and has not been verified
    if (profileData && profileData.auth.verification) {
      const {
        email,
        name,
        stat: { dateCreated },
        auth: { verification: dbVerification },
      } = profileData;

      console.log({ verification, dbVerification }, verification === dbVerification);

      if (verification === dbVerification) {
        // check if date exceeds 24 hrs

        // dateCreated
        console.log("fine");
        return;
        await mailSender({
          email: email,
          subject: "Welcome to Atlas Search Translation",
          template: "welcome",
          preheader: `Welcome ${name}!`,
        });

        await Profiles.updateOne(
          { _id: new ObjectId(ref), "auth.verification": verification },
          { $set: { "auth.verification": false } }
        );

        return res.status(200).json({ status: "Email Verification successful" });
      } else {
        console.log("fsdslhjk");

        return;

        // resend new verification link
        const newVerification = verificationGenerator();

        await mailSender({
          email,
          subject: "Email Verification",
          template: "verify",
          preheader: `Hello, ${name}! Kindly verify your email.`,
          verifyLink: `/auth/signup?verification=${newVerification}&ref=${ref}`,
          name,
        });

        await Profiles.updateOne({ _id: new ObjectId(ref) }, { $set: { "auth.verification": newVerification } });
      }
      throw { label: "Link might have expired, we just sent another verification link" };
    } else {
      throw { label: "Link might have expired or is invalid" };
    }
  } catch (err) {
    console.log(err);
    return catchError({ res, err, message: "Unable to finalize signup" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { password, email } = req.body;

    validate({ type: "email", value: email });
    validate({
      type: "password",
      value: password,
      attributes: ["hasNumber", "hasSpecialChar", "hasRange", "hasLetter"],
    });

    // verify that account exist, else throw an error
    const profileData = await Profiles.findOne({ email });
    if (!profileData) throw { label: "Invalid Email/Password" };

    const rightPassword = await bcrypt.compare(password, profileData.auth.password);

    if (rightPassword) {
      // reset wrongPassword counter
      await Profiles.updateOne({ email }, { $set: { "auth.wrongAttempts": 0 } });

      const token = jwt.sign({ session: profileData.auth.session }, process.env.SECRET, { expiresIn: "120 days" });

      return res
        .status(200)
        .json({ token, session: profileData.auth.session, userData: { name: profileData.name, role: profileData.auth.role } });
    } else {
      // increment wrongPassword counter
      await Profiles.updateOne({ email }, { $inc: { "auth.wrongAttempts": 1 } });
      throw { label: "Invalid Email/Password" };
    }
  } catch (err) {
    return catchError({ res, err, message: "A signin  error occured" });
  }
};

exports.starter = async (req, res) => {
  try {
    res.status(200).json("successful");
  } catch (err) {
    return catchError({ res, err, message: "An error occured" });
  }
};
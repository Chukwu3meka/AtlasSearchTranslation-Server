const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

const validate = require("../utils/validate");
const mailSender = require("../utils/mailSender");

const { Profiles, Suggestions } = require("../models");
const { catchError } = require("../utils/quickFunctions");
// verificationGenerator, resendVerification, differenceInHour

exports.fetchTextSuggestion = async (req, res) => {
  const limit = 5;
  try {
    const { lastDocId } = req.body;

    // // verify that account exist and has administrative right, else throw an error
    // const profileData = await Profiles.findOne({ "auth.session": session });
    // if (!profileData) throw { label: "Incorrect URL" };
    // if (!["admin", "superAdmin"].includes(profileData.auth.role)) throw { label: "Incorrect URL" };

    // get more docs than required, to see if collect has more docs for another query
    const suggestionsCursor = lastDocId
      ? Suggestions.find({}).limit(limit)
      : Suggestions.find({ _id: { $gt: ObjectId(lastDocId) } })
          .limit(limit)
          .toArray();

    // ? Suggestions.find({}).limit(limit + 1)
    // : Suggestions.find({ _id: { $gt: lastDocId } }).limit(limit + 1);

    const suggestions = await suggestionsCursor.toArray(),
      hasNextDoc = suggestionsCursor.hasNext();

    console.log(suggestions, hasNextDoc);

    return res.status(200).json({ suggestions, hasNextDoc });
  } catch (err) {
    console.log(err);
    return catchError({ res, err, message: err.message || "An error occured" });
  }
};

exports.starter = async (req, res) => {
  try {
    res.status(200).json("successful");
  } catch (err) {
    return catchError({ res, err, message: err.message || "An error occured" });
  }
};

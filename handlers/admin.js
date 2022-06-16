const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

const validate = require("../utils/validate");
const mailSender = require("../utils/mailSender");

const { Profiles } = require("../models");
const { catchError, verificationGenerator, resendVerification, differenceInHour } = require("../utils/quickFunctions");

exports.fetchTextSuggestion = async (req, res) => {
  try {
    const { initialRequest, lastDocId } = req.body;

    // // verify that account exist and has administrative right, else throw an error
    // const profileData = await Profiles.findOne({ "auth.session": session });
    // if (!profileData) throw { label: "Incorrect URL" };
    // if (!["admin", "superAdmin"].includes(profileData.auth.role)) throw { label: "Incorrect URL" };

    // // get more docs than required, to see if collect has more docs for another query
    // const suggestionsCursor = initialRequest
    //   ? Suggestions.find({}).limit(limit + 1)
    //   : Suggestions.find({ _id: { $gt: lastDocId } }).limit(limit + 1);

    // const suggestions = await suggestionsCursor.toArray(),
    //   hasNextDoc = suggestions.length > limit;

    return res.status(200).json({ suggestions: suggestions.slice(0, limit), hasNextDoc });
  } catch (err) {
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

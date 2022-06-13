const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;

const validate = require("../utils/validate");
const mailSender = require("../utils/mailSender");

const { Profiles } = require("../models");
const { catchError, verificationGenerator, resendVerification, differenceInHour } = require("../utils/quickFunctions");

exports.fetchTextSuggestion = async (req, res) => {
  try {
    // console.log(req.cookies.token, req.cookies.Name);

    // console.log(
    //   // "hey",
    //   // req.headers["authorization"],
    //   // req.header(req.headers["authorization"])
    //   // req.header(req.headers["authorization"] && req.headers["authorization"].split(" ")[0]),
    //   // req.header(req.headers["authorization"] && req.headers["authorization"].split(" ")[0] === "Bearer")
    //   // req.header(req.headers["authorization"] && req.headers["authorization"].split(" ")[0] === "Bearer")
    //   // const token = req.headers["authorization"].split(" ")[1];

    //   req.cookies.token
    // );
    res.status(200).json("successful");
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

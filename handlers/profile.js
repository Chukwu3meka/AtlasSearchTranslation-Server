// const jwt = require("jsonwebtoken");
// const Profile = require("../models/profile");
// const bcrypt = require("bcryptjs");
// const express = require("express");
// const app = express();
// const fs = require("fs");
// const path = require("path");
// const validate = require("../utils/validator").validate;
// const pushMail = require("../utils/pushMail").pushMail;

const { catchError } = require("../utils/serverFunctions");

exports.signup = async (req, res) => {
  try {
    res.status(200).json("successful");
  } catch (err) {
    console.log(err);
    return catchError({ res, err, message: "error occured" });
  }
};

exports.starter = async (req, res) => {
  try {
    res.status(200).json("successful");
  } catch (err) {
    console.log(err);
    return catchError({ res, err, message: "error occured" });
  }
};

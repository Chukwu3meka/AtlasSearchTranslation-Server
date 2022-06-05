const jwt = require("jsonwebtoken");
const Profile = require("../models/profile");
const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const validate = require("../utils/validator").validate;
const pushMail = require("../utils/pushMail").pushMail;

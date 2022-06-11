const router = require("express").Router(),
  handler = require("../handlers/profiles"),
  authWare = require("../middleware/auth");

router.route("/signup").post(handler.signup);
router.route("/signin").post(handler.signin);
router.route("/starter").post(handler.starter);

module.exports = router;

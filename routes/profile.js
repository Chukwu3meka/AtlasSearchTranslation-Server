const router = require("express").Router(),
  handler = require("../handlers/profile"),
  authWare = require("../middleware/auth");

router.route("/signup").post(handler.signup);
router.route("/starter").post(handler.starter);

module.exports = router;

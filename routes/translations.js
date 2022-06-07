const router = require("express").Router(),
  handler = require("../handlers/admin"),
  authWare = require("../middleware/auth");

router.route("/signup").post(handler.signup);

module.exports = router;

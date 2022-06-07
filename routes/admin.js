const router = require("express").Router(),
  handler = require("../handlers/admin"),
  authWare = require("../middleware/auth");

router.route("/signup").post(authWare, handler.signup);
router.route("/starter").post(authWare, handler.starter);

module.exports = router;

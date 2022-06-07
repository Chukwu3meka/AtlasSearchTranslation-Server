const router = require("express").Router(),
  handler = require("../handlers/translations"),
  authWare = require("../middleware/auth");

router.route("/searchTranslation").post(handler.searchTranslation);

module.exports = router;

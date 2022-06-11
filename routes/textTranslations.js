const router = require("express").Router(),
  handler = require("../handlers/textTranslations"),
  authWare = require("../middleware/auth");

router.route("/searchTranslation").post(handler.searchTranslation);
router.route("/suggestTranslation").post(handler.suggestTranslation);
router.route("/starter").post(handler.starter);

module.exports = router;

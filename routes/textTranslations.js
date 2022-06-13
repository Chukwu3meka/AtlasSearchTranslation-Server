const router = require("express").Router(),
  routeDandler = require("../handlers/textTranslations"),
  headerAuthWare = require("../middleware/headerAuth");

router.route("/searchTranslation").post(routeDandler.searchTranslation);
router.route("/suggestTranslation").post(routeDandler.suggestTranslation);
router.route("/starter").post(routeDandler.starter);

module.exports = router;

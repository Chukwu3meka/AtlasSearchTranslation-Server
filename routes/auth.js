const router = require("express").Router(),
  routeHandler = require("../handlers/auth"),
  headerAuthWare = require("../middleware/headerAuth");

router.route("/signup").post(routeHandler.signup);
router.route("/finalizeSignup").post(routeHandler.finalizeSignup);
router.route("/signin").post(routeHandler.signin);
router.route("/verifyToken").post(routeHandler.verifyToken);
router.route("/starter").post(routeHandler.starter);

module.exports = router;

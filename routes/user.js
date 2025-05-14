const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utlis/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const {
  renderSignup,
  signup,
  renderLogin,
  login,
  logout,
} = require("../controllers/users.js");
router.route("/signup").get(renderSignup).post(wrapAsync(signup));

router
  .route("/login")
  .get(renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  );

router.get("/logout", logout);
module.exports = router;

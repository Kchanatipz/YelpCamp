const express = require("express");
const passport = require("passport");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { storeReturnTo } = require("../utils/storeReturnTo");

const router = express.Router();

// desc     get register form
// route    GET /register
router.get("/register", (req, res) => {
  res.render("users/register");
});

// desc     create new user
// route    POST /register
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const regUser = await User.register(user, password);
      req.login(regUser, (err) => {
        // auto login when register
        // requires a callback
        if (err) {
          return next(err);
        } else {
          req.flash("success", "Welcome to Yelp Camp");
          res.redirect("/campgrounds");
        }
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/campgrounds");
    }
  })
);

// desc     get login form
// route    GET /login
router.get("/login", (req, res) => {
  res.render("users/login");
});

// desc     login user
// route    POST /login
const passportConfig = {
  failureFlash: true,
  failureRedirect: "/login",
};

// session is cleared after .authenticate is executed
// so we create middleware to store retunTo value
// in locals instead of session
router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", passportConfig),
  async (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    // this function requires a callback
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;

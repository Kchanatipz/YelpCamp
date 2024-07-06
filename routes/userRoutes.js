const express = require("express");
const passport = require("passport");

const {
  getRegisterForm,
  registerUser,
  getLoginForm,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const { catchAsync, storeReturnTo } = require("../utils/middlewares");

const router = express.Router();

router.route("/register").get(getRegisterForm).post(catchAsync(registerUser));

router.get("/login", getLoginForm);

const passportConfig = {
  failureFlash: true,
  failureRedirect: "/login",
};

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", passportConfig),
  loginUser
);

router.get("/logout", logoutUser);

module.exports = router;

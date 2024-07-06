const User = require("../models/userModel");

const Review = require("../models/reviewModel");

// desc     get register form
// route    GET /register
module.exports.getRegisterForm = (req, res) => {
  res.render("users/register");
};

// desc     create new user
// route    POST /register
module.exports.registerUser = async (req, res) => {
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
};

// desc     get login form
// route    GET /login
module.exports.getLoginForm = (req, res) => {
  res.render("users/login");
};

// desc     login user
// route    POST /login
module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// desc     logout user
// route    POST /logout
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    // this function requires a callback
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};

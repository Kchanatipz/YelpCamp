const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgroundRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const User = require("./models/userModel");
const { helmetConfig } = require("./utils/helmetConfig");
const MongoDBStore = require("connect-mongo");

const app = express();

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1/yelpCamp";
const secret = process.env.SECRET || "NotQuiteASecret";
const port = process.env.PORT || 3000;

// config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    // secret: Secret,
    secret,
  },
});

store.on("error", (e) => {
  console.log("Session store error", e);
});

const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    // secure: true
  },
  store,
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
// to use persistent login session
app.use(passport.session());
// authenticate user
passport.use(new passportLocal(User.authenticate()));
// how to store & retrieve information(user) in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// for mongo injection
app.use(mongoSanitize());
app.use(helmet());
app.use(helmet.contentSecurityPolicy(helmetConfig));

const connectDB = require("./db");
const makeDB = require("./seed/index");
connectDB(dbUrl);
// makeDB();

// store local data which can be
// access by templates or other middlewares
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // from passport middleware
  // req.user is the user that is authenticated
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:campId/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// throw page not found error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// catch all errors and render error.ejs page
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong :(";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

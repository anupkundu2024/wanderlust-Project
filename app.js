// MYTIMING=
/* =========================================
 * PROJECT TIMELINE LOG   ***HELP BY SHARDHA MAM
 * =========================================

 MAJOR PROJECT PHASE 1
 =========================================
 Part A
 -----------------------------------------
 Sat, Mar  1, 2025  7:47:02 PM
 Sun, Mar  2, 2025  7:35:53 PM
 Mon, Mar  3, 2025 10:51:53 AM
 Tue, Mar  4, 2025  8:09:05 PM
 Wed, Mar  5, 2025  7:15:22 PM
 Thu, Mar  6, 2025  9:16:06 AM

 Part B
 -----------------------------------------
 Fri, Mar  7, 2025 10:57:12 AM, 7:22:11 PM
 Sat, Mar  8, 2025  9:11:16 AM, 7:07:34 PM

 Part C
 -----------------------------------------
 Fri, Mar 21, 2025  9:09:15 PM - Started project phase 1, part C
 Sat, Mar 22, 2025  8:29:21 AM
 Sat, Mar 22, 2025  7:17:18 PM
 Sun, Mar 23, 2025 11:00:58 AM
 Mon, Mar 24, 2025  7:12:41 PM
 Tue, Mar 25, 2025  8:56:32 AM, 12:55:51 PM

 MAJOR PROJECT PHASE 2
 =========================================
 Part A
 -----------------------------------------
 Fri, Mar 28, 2025 10:29:11 AM - Start of project phase 2, part A
 Sat, Mar 29, 2025  9:37:14 AM, 7:37:54 PM
 Sun, Mar 30, 2025 11:00:28 AM, 4:50:06 PM, 7:38:20 PM - End of project phase 2, part A

 Part B & C
 -----------------------------------------
 Mon, Mar 31, 2025 10:29:24 AM - 12:01:09 PM, 6:21:23 PM - 10:05:42 PM - Start of project phase 2, parts B & C
 Tue, Apr  1, 2025 11:29:29 AM
 Wed, Apr  2, 2025  7:32:15 PM
 Thu, Apr  3, 2025  8:57:08 PM
 Fri, Apr  4, 2025  6:21:47 PM
 Sat, Apr  5, 2025  9:45:35 AM
 Sun, Apr  6, 2025  9:15:25 PM
 Mon, Apr  7, 2025  7:03:50 PM
 Wed, Apr  9, 2025  8:58:52 PM - Note: KAL GOING TO HOME IN RUPASI BANGALA

 PROJECT RESTART
 =========================================
 Tue, Apr 22, 2025  8:44:34 AM - Restart of coding journey
 Tue, Apr 22, 2025  7:15:00 PM
 Wed, Apr 23, 2025  7:39:50 PM
 Thu, Apr 24, 2025  7:34:36 PM
 Sat, Apr 26, 2025  9:06:32 PM
 Sun, Apr 27, 2025
 Sun, Apr 27, 2025  6:35:41 PM
 Mon, Apr 28, 2025 10:56:27 AM, 7:28:59 PM
 Tue, Apr 29, 2025  6:28:52 PM
 Thu, May  1, 2025 11:59:42 AM
 Fri, May  2, 2025  7:08:05 PM
 Sat, May  3, 2025 10:38:39 AM, 9:17:38 PM
 Sun, May  4, 2025 10:24:01 AM, 7:30:54 PM
 Mon, May  5, 2025  7:18:36 PM
 Tue, May  6, 2025  8:10:28 PM
 Fri, May  9, 2025 10:57:22 AM
PROJECT PHASE 3 PART B
Sat, May 10, 2025 10:11:42 AM,5:03:28 PM
Sun, May 11, 2025  9:56:37 AM
Mon, May 12, 2025  8:01:49 PM
Tue, May 13, 2025  4:55:22 PM,7:18:14 PM
Wed, May 14, 2025 10:19:48 AM, 4:29:33 PM
*/

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utlis/wrapAsync.js");
const ExpressError = require("./utlis/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { validateListing } = require("./middelware");

app.use(express.json()); // Parse JSON body
app.post("/your-endpoint", validateListing, (req, res) => {
  res.send("Listing validated!");
});

// let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connect to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log("Current user:", req.user);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/", (req, res) => {
//   res.send("Hi, I am server");
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  console.log("Catch-all triggered for:", req.path);

  console.error(err.stack);
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});

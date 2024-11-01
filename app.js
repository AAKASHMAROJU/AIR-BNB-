if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log(process.env.secret);
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // store the session info in the mongo atlas store
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_ATLAS_URL,
  crypto: {
    secret: "mysupersecret",
  },
  touchAfter: 24 * 60 * 60,
});

const sessionOptions = {
  store,
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

store.on("error", (err) => {
  console.log("Error in Session Store ", err);
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

app.use("/listings", listingRouter);

app.use("/listings/:id/review", reviewRouter);

app.use("/", userRouter);

const MONGODB_URL = process.env.MONGO_ATLAS_URL;

async function main() {
  await mongoose.connect(MONGODB_URL);
}

main()
  .then(() => console.log("DataBase Connected Successfully"))
  .catch((err) => console.log(err));

// app.get("/demoUser", async (req, res) => {
//   const doc1 = new User({ useremail: "aakash@gmail.com", username: "Aakash" });
//   let registeredUser = await User.register(doc1, "password@123");
//   res.send(registeredUser);
// });

app.get("/", (req, res) => {
  res.render("index");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  // console.log(err);
  const { statusCode = 500, message = "Something went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.send("I Handled the Error it is " + err);
});

app.listen(port, () => {
  console.log("The Server has Started at Port " + port);
});

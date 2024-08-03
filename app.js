const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const listing = require("./routes/listing");
const review = require("./routes/review");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mysupersecret",
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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

app.use("/listings", listing);

app.use("/listings/:id/review", review);

const MONGODB_URL = "mongodb://localhost:27017/airbnb-db";

async function main() {
  await mongoose.connect(MONGODB_URL);
}

main()
  .then(() => console.log("DataBase Connected Successfully"))
  .catch((err) => console.log(err));

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

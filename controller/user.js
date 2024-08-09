const User = require("../models/user");
module.exports.renderSignUp = (req, res, next) => {
  //   res.send("User singed in Successfully");
  res.render("user/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // // // console.log(email, password, username);
    const user1 = new User({
      email,
      username,
    });
    const reg_user = await User.register(user1, password);
    // // console.log(reg_user);
    req.login(reg_user, (err) => {
      if (err) {
        next(err);
      } else {
        req.flash("success", "Welcome to te AIR BNB " + username);
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }

  //   res.send("Heyyy Login aipoyaav mowa");
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res, next) => {
  req.flash("success", "User Logged In Successfully");
  // // console.log(res.locals.redirectUrl);

  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "user logged out successfully");
      res.redirect("/listings");
    }
  });
};

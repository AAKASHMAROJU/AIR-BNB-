const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you need to login");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = isLoggedIn;

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("Lemme store here");

    req.session.redirectUrl = req.originalUrl;
    console.log("The url goes like ", req.session.redirectUrl);

    req.flash("error", "you need to login");
    return res.redirect("/login");
  }
  return next();
};

module.exports.saveRedirectUrl = async (req, res, next) => {
  console.log("Hello");
  if (req.session.redirectUrl) res.locals.redirectUrl = req.session.redirectUrl;
  console.log("Ippdu value entha ", res.locals.redirectUrl);

  next();
};

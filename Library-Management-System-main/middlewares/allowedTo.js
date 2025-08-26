const userRoles = require("../utils/userRoles");

module.exports = (...roles) => {
  //roles الانا سامح بيها
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};

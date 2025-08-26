const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userRole = require("../utils/userRoles");
userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Filed must be a valid email address.",
    },
  },
  password: {
    type: String,
    required: true,
    //   validate: {
    //    validator: (value) => validator.isStrongPassword(value),
    //     message: "Filed must be a strong password.",
    // },
  },
  role: {
    type: String,
    enum: [userRole.USER, userRole.ADMIN,userRole.AUTHOR],
    default: userRole.USER,
  },
  token: {
    type: String,
  },
  avatar: {
    type: String,
    default: "../uploads/default-avatar.jpg",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
const userModel = require("../modules/user");
const httpStatusText = require("../utils/httpStatusText");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcrypt");
const asyncWrapper = require("../middlewares/asyncWrapper");
const generateJWT = require("../utils/generateJWT");

const register = asyncWrapper(async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    const error = new Error("user already exists");
    error.status = 400;
    return next(error);
  }
  const avatarFileName = req.file ? req.file.filename : undefined;
  const newUser = await userModel.create({
    username,
    email,
    password,
    role,
    avatar: avatarFileName,
  });
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  res.status(200).json({ status: httpStatusText.SUCCESS, data: newUser });
});


const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    return next(error);
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    return next(error);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    return next(error);
  }
  const token = await generateJWT({
    email: user.email,
    id: user._id,
    role: user.role,
  });
  user.token = token;
  res.status(200).json({ status: httpStatusText.SUCCESS, data: user });
});

module.exports = { login, register };
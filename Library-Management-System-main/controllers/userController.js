const userModel = require("../modules/user");
const httpStatusText = require("../utils/httpStatusText");
const { validationResult, query } = require("express-validator");
const bcrypt = require("bcrypt");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getUsers = asyncWrapper(async (req, res) => {
  const users = await userModel.find({}, { __v: false, password: false });
  if (users.length === 0)
    return res.status(404).json({ status: httpStatusText.FAIL, data: users });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: users });
});

const getUser = asyncWrapper(async (req, res) => {
  const userId = req.params.userId;
  const user = await userModel.findById(userId);
  if (!user)
    return res.status(404).json({ status: httpStatusText.FAIL, data: user });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: user });
});

const addUser = asyncWrapper(async (req, res) => {    
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: error.array() });
  }
  const user = await userModel.create(req.body);
  res.status(201).json({ status: httpStatusText.SUCCESS, data: user });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const userId = req.params.userId;
  const user = await userModel.findByIdAndDelete(userId);
  if (!user)
    return res.status(404).json({ status: httpStatusText.FAIL, data: user });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: user });
});

const UpdateUser = asyncWrapper(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: error.array() });
  const userId = req.params.userId;
  const user = await userModel.findByIdAndUpdate(
    userId,
    {
      $set: { ...req.body },
    },
    { new: true }
  );
  if (!user)
    return res.status(404).json({ status: httpStatusText.FAIL, data: user });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: user });
});
module.exports = { getUsers, getUser, addUser, deleteUser, UpdateUser };

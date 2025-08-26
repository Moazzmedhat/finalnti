const authorModel = require("../modules/author");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { validationResult } = require("express-validator");

// Get all authors
const getAuthors = asyncWrapper(async (req, res) => {
  const authors = await authorModel.find();
  if (authors.length === 0)
    return res.status(404).json({ status: httpStatusText.FAIL, data: authors });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: authors });
});

// Get one author
const getAuthor = asyncWrapper(async (req, res) => {
  const author = await authorModel.findById(req.params.authorId);
  if (!author)
    return res.status(404).json({ status: httpStatusText.FAIL, data: author });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: author });
});

// Add author
const addAuthor = asyncWrapper(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: error.array() });

  const author = await authorModel.create(req.body);
  res.status(201).json({ status: httpStatusText.SUCCESS, data: author });
});

// Update author
const updateAuthor = asyncWrapper(async (req, res) => {
  const author = await authorModel.findByIdAndUpdate(
    req.params.authorId,
    { $set: { ...req.body } },
    { new: true }
  );
  if (!author)
    return res.status(404).json({ status: httpStatusText.FAIL, data: author });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: author });
});

// Delete author
const deleteAuthor = asyncWrapper(async (req, res) => {
  const author = await authorModel.findByIdAndDelete(req.params.authorId);
  if (!author)
    return res.status(404).json({ status: httpStatusText.FAIL, data: author });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: author });
});

module.exports = {
  getAuthors,
  getAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};

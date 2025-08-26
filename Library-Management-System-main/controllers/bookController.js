const bookModel = require("../modules/book");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { validationResult } = require("express-validator");

// Get all books
const getBooks = asyncWrapper(async (req, res) => {
  const books = await bookModel.find().populate("author", "name");
  if (books.length === 0)
    return res.status(404).json({ status: httpStatusText.FAIL, data: books });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: books });
});

// Get one book
const getBook = asyncWrapper(async (req, res) => {
  const book = await bookModel
    .findById(req.params.bookId)
    .populate("author", "name");
  if (!book)
    return res.status(404).json({ status: httpStatusText.FAIL, data: book });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: book });
});

// Add book
const addBook = asyncWrapper(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: error.array() });

  const book = await bookModel.create(req.body);
  res.status(201).json({ status: httpStatusText.SUCCESS, data: book });
});

// Update book
const updateBook = asyncWrapper(async (req, res) => {
  const book = await bookModel.findByIdAndUpdate(
    req.params.bookId,
    { $set: { ...req.body } },
    { new: true }
  );
  if (!book)
    return res.status(404).json({ status: httpStatusText.FAIL, data: book });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: book });
});

// Delete book
const deleteBook = asyncWrapper(async (req, res) => {
  const book = await bookModel.findByIdAndDelete(req.params.bookId);
  if (!book)
    return res.status(404).json({ status: httpStatusText.FAIL, data: book });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: book });
});

module.exports = { getBooks, getBook, addBook, updateBook, deleteBook };

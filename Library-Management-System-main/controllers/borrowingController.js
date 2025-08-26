const borrowingModel = require("../modules/borrowing");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { validationResult } = require("express-validator");

// Get all borrowings
const getBorrowings = asyncWrapper(async (req, res) => {
  const borrowings = await borrowingModel
    .find()
    .populate("user", "username email")
    .populate("book", "title");
  if (borrowings.length === 0)
    return res
      .status(404)
      .json({ status: httpStatusText.FAIL, data: borrowings });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: borrowings });
});

// Get one borrowing
const getBorrowing = asyncWrapper(async (req, res) => {
  const borrowing = await borrowingModel
    .findById(req.params.borrowingId)
    .populate("user", "username email")
    .populate("book", "title");
  if (!borrowing)
    return res
      .status(404)
      .json({ status: httpStatusText.FAIL, data: borrowing });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: borrowing });
});

// Add borrowing (user taken from token)
const addBorrowing = asyncWrapper(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: error.array() });

  const userId = req.currentUser?.id || req.currentUser?._id;
  if (!userId)
    return res
      .status(401)
      .json({ status: httpStatusText.FAIL, message: 'Unauthorized' });

  const payload = {
    user: userId,
    book: req.body.book,
    borrowedAt: req.body.borrowedAt || new Date(),
    returnedAt: req.body.returnedAt || null,
    status: req.body.status || 'borrowed',
  };

  const borrowing = await borrowingModel.create(payload);
  res.status(201).json({ status: httpStatusText.SUCCESS, data: borrowing });
});

// Update borrowing (e.g., returning a book)
const updateBorrowing = asyncWrapper(async (req, res) => {
  const currentRole = req.currentUser?.role;
  const currentUserId = req.currentUser?.id || req.currentUser?._id;
  const borrowingId = req.params.borrowingId;

  if (!borrowingId)
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: 'Borrowing ID is required' });

  // Users can only update their own borrowing and only mark as returned
  if (currentRole === 'User') {
    const existing = await borrowingModel.findById(borrowingId);
    if (!existing)
      return res
        .status(404)
        .json({ status: httpStatusText.FAIL, data: existing });

    const ownerId = (existing.user?._id || existing.user?.id || existing.user)?.toString?.() || existing.user?.toString?.();
    if (!ownerId || ownerId !== String(currentUserId)) {
      return res.status(403).json({ status: httpStatusText.FAIL, message: 'Forbidden' });
    }

    const wantsReturn = (req.body.status || '').toLowerCase() === 'returned';
    if (!wantsReturn) {
      return res.status(400).json({ status: httpStatusText.FAIL, message: 'Only returning is allowed for users' });
    }

    const borrowing = await borrowingModel
      .findByIdAndUpdate(
        borrowingId,
        { $set: { status: 'returned', returnedAt: new Date() } },
        { new: true }
      )
      .populate('user', 'username email')
      .populate('book', 'title');

    return res.status(200).json({ status: httpStatusText.SUCCESS, data: borrowing });
  }

  // Admin/Author: allow general updates (existing behavior)
  const borrowing = await borrowingModel
    .findByIdAndUpdate(
      borrowingId,
      { $set: { ...req.body } },
      { new: true }
    )
    .populate('user', 'username email')
    .populate('book', 'title');

  if (!borrowing)
    return res
      .status(404)
      .json({ status: httpStatusText.FAIL, data: borrowing });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: borrowing });
});

// Delete borrowing
const deleteBorrowing = asyncWrapper(async (req, res) => {
  const borrowing = await borrowingModel.findByIdAndDelete(
    req.params.borrowingId
  );
  if (!borrowing)
    return res
      .status(404)
      .json({ status: httpStatusText.FAIL, data: borrowing });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: borrowing });
});

module.exports = {
  getBorrowings,
  getBorrowing,
  addBorrowing,
  updateBorrowing,
  deleteBorrowing,
};

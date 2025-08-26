const mongoose = require("mongoose");

const borrowingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
  borrowedAt: {
    type: Date,
    default: Date.now,
  },
  returnedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["borrowed", "returned"],
    default: "borrowed",
  },
});

const borrowingModel = mongoose.model("borrowing", borrowingSchema);
module.exports = borrowingModel;

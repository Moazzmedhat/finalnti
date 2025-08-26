const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "author",
    required: true,
  },
  publishedYear: {
    type: Number,
  },
  pdf: {
    type: String,
  },
});

const bookModel = mongoose.model("book", bookSchema);
module.exports = bookModel;

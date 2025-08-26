const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthYear: {
    type: Number,
  },
});

const authorModel = mongoose.model("author", authorSchema);
module.exports = authorModel;

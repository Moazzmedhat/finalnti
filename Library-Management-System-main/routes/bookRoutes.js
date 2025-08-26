const {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const verifyToken = require("../middlewares/verifyToken");
const router = require("express").Router();
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");
router
  .route("/")
  .get(verifyToken, getBooks)
  .post(verifyToken, allowedTo(userRoles.ADMIN, userRoles.AUTHOR), addBook);

router
  .route("/:bookId")
  .get(verifyToken, getBook)
  .put(verifyToken, allowedTo(userRoles.ADMIN, userRoles.AUTHOR), updateBook)
  .delete(verifyToken, allowedTo(userRoles.ADMIN), deleteBook);

module.exports = router;

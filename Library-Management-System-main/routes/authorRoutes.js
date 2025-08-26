const {
  getAuthors,
  getAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

const router = require("express").Router();
const verifyToken=require('../middlewares/verifyToken')
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");
router.route("/")
  .get(verifyToken,getAuthors)
  .post(verifyToken,allowedTo(userRoles.ADMIN),addAuthor);

router.route("/:authorId")
  .get(verifyToken,getAuthor)
  .put(verifyToken,allowedTo(userRoles.ADMIN),updateAuthor)
  .delete(verifyToken,allowedTo(userRoles.ADMIN),deleteAuthor);

module.exports = router;
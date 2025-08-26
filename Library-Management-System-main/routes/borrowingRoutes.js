const express = require("express");
const router = express.Router();
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRoles");
const verifyToken = require("../middlewares/verifyToken");
const {
  getBorrowings,
  getBorrowing,
  addBorrowing,
  updateBorrowing,
  deleteBorrowing,
} = require("../controllers/borrowingController");

// REST APIs
router
  .route("/")
  .get(verifyToken, getBorrowings)
  .post(verifyToken, allowedTo(userRoles.ADMIN, userRoles.AUTHOR, userRoles.USER), addBorrowing);

router
  .route("/:borrowingId")
  .get(verifyToken, getBorrowing)
  .put(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.AUTHOR, userRoles.USER),
    updateBorrowing
  )
  .delete(verifyToken, allowedTo(userRoles.ADMIN), deleteBorrowing);

module.exports = router;

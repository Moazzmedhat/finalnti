const {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  UpdateUser,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const router = require("express").Router();
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRoles");
router
  .route("/")
  .get(verifyToken, getUsers)
  .post(verifyToken, allowedTo(userRoles.ADMIN), addUser);

router
  .route("/:userId")
  .get(verifyToken, getUser)
  .put(verifyToken, allowedTo(userRoles.ADMIN), UpdateUser)
  .delete(verifyToken, allowedTo(userRoles.ADMIN), deleteUser);

module.exports = router;

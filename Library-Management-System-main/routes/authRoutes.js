const router = require("express").Router();
const multer = require("multer");
const httpStatusText = require("../utils/httpStatusText");

const diskStorge = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const extention = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${extention}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb({
      status: httpStatusText.ERROR,
      message: "file must be an image",
    });
  }
};

const upload = multer({ storage: diskStorge, fileFilter });

const { login, register } = require("../controllers/authController");

router.route("/log").post(login);

router.route("/reg").post(upload.single("avatar"), register);

module.exports = router;
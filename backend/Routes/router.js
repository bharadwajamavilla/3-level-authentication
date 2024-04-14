const express = require("express");
const router = new express.Router();
const multer = require("multer");
const path = require("path");

const controllers = require("../controllers/userControllers");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/user/register", controllers.userregister);
router.post("/user/loginuser", controllers.userloginpass);
router.post("/user/sendotp", controllers.userOtpSend);
router.post("/user/login", controllers.userLogin);
router.post("/register/upload", upload.single("file"), controllers.imageUpload);
router.post(
  "/login/upload",
  upload.single("file"),
  controllers.loginImageUpload
);

module.exports = router;

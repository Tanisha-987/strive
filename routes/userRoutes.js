const express = require("express");
const router = express.Router();
const { Signup} = require("../controllers/userController");
const upload = require("../middleware/multer");
const { VerifyOtp } = require("../controllers/authController");

router.post("/signup",upload.single("cv"), Signup);
router.post("/verifyotp",VerifyOtp);


module.exports = router;

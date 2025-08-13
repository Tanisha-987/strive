const Seeker = require("../models/JobSeekerModel");
const Provider = require("../models/JobProviderModel");
const TempModel = require("../models/TempModel");
const OtpModel = require("../models/OtpModel");

require("dotenv").config();

exports.VerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempOtp = await OtpModel.findOne({ email });
    if (!tempOtp) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    if (tempOtp.expires < Date.now()) {
      await OtpModel.deleteOne({ email });
      await TempModel.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired. Please try again." });
    }

    if (tempOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const tempUser = await TempModel.findOne({ email });
    if (!tempUser) {
      return res.status(400).json({ success: false, message: "Temporary user not found" });
    }

    // Decide which model to use based on role
    if (tempUser.role === "seeker") {
      const newSeeker = new Seeker({
        fullname: tempUser.fullname,
        email: tempUser.email,
        phone: tempUser.phone,
        cv: tempUser.cv,
        // add any other fields needed in Seeker schema
      });
      await newSeeker.save();

    } else if (tempUser.role === "provider") {
      const newProvider = new Provider({
        companyname: tempUser.companyname,
        email: tempUser.email,
        phone: tempUser.phone,
        hiring: tempUser.hiring,
        // add other Provider schema fields if any
      });
      await newProvider.save();

    } else {
      return res.status(400).json({ success: false, message: "Invalid role type" });
    }

    // Clean up temp data
    await TempModel.deleteOne({ email });
    await OtpModel.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified and user registered successfully."
    });

  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

const TempModel = require("../models/TempModel");
const OtpModel = require("../models/OtpModel");
const Seeker = require("../models/JobSeekerModel");
const Provider = require("../models/JobProviderModel");
const sendMail = require("../config/nodemailer")

exports.Signup = async (req, res) => {
  try {
    const { fullname,companyname, email, phone,role , hiring  } = req.body;
    const resume = req.file.path 

    const existingSeeker = await Seeker.findOne({ email });
    if (existingSeeker) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const existingTempUser = await TempModel.findOne({ email });
    if (existingTempUser) {
      return res.status(400).json({ success: false, message: "Please verify your email first" });
    }

    const existingTempOtp = await OtpModel.findOne({ email });
    if (existingTempOtp) {
      return res.status(400).json({ success: false, message: `OTP already sent to your mail ${email}` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const tempUser = new TempModel({
      fullname,
      companyname,
      email,
      phone,
      role,
      hiring,
      cv: resume
    });

    const tempOtp = new OtpModel({
      email,
      otp: otp,
      expires: otpExpires,
    })

    await tempUser.save();
    await tempOtp.save()
    
    await sendMail(email, "signup" , otp , tempUser.username);

    res.status(201).json({ success: true, message: "OTP sent to email. Please verify." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};
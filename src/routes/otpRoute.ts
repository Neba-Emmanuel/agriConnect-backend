import express from "express";

const router = express.Router();
const User = require("../models/Users");

router.post("/verify-email", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark the email as verified
    user.verified = true;
    user.otp = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Failed to verify email" });
  }
});

export default router;

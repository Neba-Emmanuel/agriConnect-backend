"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const User = require("../models/User"); // Import your User model
// Example route in Express
const Otp = async (req, res) => {
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
        user.otp = null; // Clear the OTP after verification
        await user.save();
        return res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ error: "Failed to verify email" });
    }
};
exports.Otp = Otp;

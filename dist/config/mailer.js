"use strict";
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const transporter = nodemailer.createTransport({
    // Configure your email service provider
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});
// Function to generate OTP
const generateOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: "numeric",
    });
};
// Function to send OTP via email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: "agriconnect@gmail.com",
        to: email,
        subject: "OTP for Email Verification",
        text: `Your OTP for email verification is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
};

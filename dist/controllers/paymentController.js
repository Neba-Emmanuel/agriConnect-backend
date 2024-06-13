"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectPayment = void 0;
const lib_1 = require("@hachther/mesomb/lib");
const Payments_1 = __importDefault(require("../models/Payments"));
const Users_1 = __importDefault(require("../models/Users"));
const collectPayment = async (req, res) => {
    const { amount, service, payer } = req.body;
    if (!amount || !service || !payer) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        // Get the authenticated user ID
        const userId = req.user._id;
        // Verify the user exists
        const user = await Users_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const payment = new lib_1.PaymentOperation({
            applicationKey: process.env.MESOMB_APPLICATION_KEY,
            accessKey: process.env.MESOMB_ACCESS_KEY,
            secretKey: process.env.MESOMB_SECRET_KEY,
        });
        const response = await payment.makeCollect({
            amount,
            service,
            payer,
            nonce: lib_1.RandomGenerator.nonce(),
        });
        const paymentDetails = new Payments_1.default({
            user: user._id,
            amount,
            service,
            payer,
            status: response.isTransactionSuccess() ? "success" : "failed",
        });
        await paymentDetails.save();
        return res.status(200).json({
            operationSuccess: response.isOperationSuccess(),
            transactionSuccess: response.isTransactionSuccess(),
            data: response,
        });
    }
    catch (error) {
        console.error("Payment error:", error);
        return res.status(500).json({ error: "Payment processing failed" });
    }
};
exports.collectPayment = collectPayment;

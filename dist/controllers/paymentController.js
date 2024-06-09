"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectPayment = void 0;
const Payments_1 = __importDefault(require("../models/Payments"));
const Users_1 = __importDefault(require("../models/Users"));
const mockPayment_1 = require("../utils/mockPayment");
// Custom nonce generator
const generateNonce = () => {
    return (Math.random().toString(36).substr(2, 15) +
        Math.random().toString(36).substr(2, 15));
};
const collectPayment = async (req, res) => {
    const { amount, service, payer } = req.body;
    if (!amount || !service || !payer) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        // Get the authenticated user ID
        const userId = req.user?._id;
        // Verify the user exists
        const user = await Users_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const nonce = generateNonce();
        const response = await (0, mockPayment_1.makeCollect)(amount, service, payer, nonce);
        const paymentDetails = new Payments_1.default({
            user: user._id,
            amount,
            service,
            payer,
            status: response.transactionSuccess ? "success" : "failed",
        });
        await paymentDetails.save();
        return res.status(200).json({
            operationSuccess: response.operationSuccess,
            transactionSuccess: response.transactionSuccess,
            data: response.data,
        });
    }
    catch (error) {
        console.error("Payment error:", error);
        return res.status(500).json({ error: "Payment processing failed" });
    }
};
exports.collectPayment = collectPayment;

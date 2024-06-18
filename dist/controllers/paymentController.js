"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectPayment = void 0;
const lib_1 = require("@hachther/mesomb/lib");
const Payments_1 = __importDefault(require("../models/Payments"));
const Orders_1 = require("../models/Orders");
const Users_1 = __importDefault(require("../models/Users"));
const mongoose_1 = __importDefault(require("mongoose"));
const collectPayment = async (req, res) => {
    const { amount, service, payer, products, address } = req.body;
    if (!amount || !service || !payer || !products || !address) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userId = req.user._id;
        const user = await Users_1.default.findById(userId);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: "User not found" });
        }
        const paymentOperation = new lib_1.PaymentOperation({
            applicationKey: process.env.MESOMB_APPLICATION_KEY,
            accessKey: process.env.MESOMB_ACCESS_KEY,
            secretKey: process.env.MESOMB_SECRET_KEY,
        });
        const response = await paymentOperation.makeCollect({
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
        await paymentDetails.save({ session });
        if (response.isTransactionSuccess()) {
            const orderProducts = await Promise.all(products.map(async (product) => {
                const productData = await Orders_1.Product.findById(product.productId);
                return { productId: productData?._id, quantity: product.quantity };
            }));
            const order = new Orders_1.Order({
                user: user._id,
                products: orderProducts,
                totalAmount: amount,
                address,
                status: "pending",
            });
            await order.save({ session });
        }
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            operationSuccess: response.isOperationSuccess(),
            transactionSuccess: response.isTransactionSuccess(),
            data: response,
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Payment error:", error);
        return res.status(500).json({ error: "Payment processing failed" });
    }
};
exports.collectPayment = collectPayment;

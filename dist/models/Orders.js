"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "completed", "failed"],
    },
    createdAt: { type: Date, default: Date.now },
});
const Order = mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;

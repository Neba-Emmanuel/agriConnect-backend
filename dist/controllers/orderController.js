"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = void 0;
const Orders_1 = __importDefault(require("../models/Orders"));
const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders_1.default.find()
            .populate("user", "name email")
            .populate("products.productId", "name price");
        console.log(JSON.stringify(orders, null, 2));
        res.status(200).json({ success: true, orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};
exports.getAllOrders = getAllOrders;

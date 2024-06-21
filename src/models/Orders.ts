import mongoose from "mongoose";
import Product from "./Products";

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
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

const Order = mongoose.model("Order", OrderSchema);

export default Order;

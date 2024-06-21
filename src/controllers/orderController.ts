import Order from "../models/Orders";
import { Request, Response } from "express";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.productId", "name price");

    console.log(JSON.stringify(orders, null, 2));

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

import { Request, Response } from "express";
import { PaymentOperation, RandomGenerator } from "@hachther/mesomb/lib";
import Payment, { IPayment } from "../models/Payments";
import Order from "../models/Orders";
import Product from "../models/Products";
import User from "../models/Users";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  user?: any;
}

export const collectPayment = async (req: CustomRequest, res: Response) => {
  const { amount, service, payer, products, address } = req.body;

  if (!amount || !service || !payer || !products || !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "User not found" });
    }

    const paymentOperation = new PaymentOperation({
      applicationKey: process.env.MESOMB_APPLICATION_KEY!,
      accessKey: process.env.MESOMB_ACCESS_KEY!,
      secretKey: process.env.MESOMB_SECRET_KEY!,
    });

    const response = await paymentOperation.makeCollect({
      amount,
      service,
      payer,
      nonce: RandomGenerator.nonce(),
    });

    const paymentDetails: IPayment = new Payment({
      user: user._id,
      amount,
      service,
      payer,
      status: response.isTransactionSuccess() ? "success" : "failed",
    });

    await paymentDetails.save({ session });

    if (response.isTransactionSuccess()) {
      const orderProducts = await Promise.all(
        products.map(
          async (product: { productId: string; quantity: number }) => {
            const productData = await Product.findById(product.productId);
            return { productId: productData?._id, quantity: product.quantity };
          }
        )
      );

      const order = new Order({
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
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment error:", error);
    return res.status(500).json({ error: "Payment processing failed" });
  }
};

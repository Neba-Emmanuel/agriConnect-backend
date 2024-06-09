import { Request, Response } from "express";
import Payment, { IPayment } from "../models/Payments";
import User from "../models/Users";
import { makeCollect } from "../utils/mockPayment";

// Custom nonce generator
const generateNonce = (): string => {
  return (
    Math.random().toString(36).substr(2, 15) +
    Math.random().toString(36).substr(2, 15)
  );
};

export const collectPayment = async (req: Request, res: Response) => {
  const { amount, service, payer } = req.body;

  if (!amount || !service || !payer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get the authenticated user ID
    const userId = req.user?._id;

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const nonce = generateNonce();
    const response = await makeCollect(amount, service, payer, nonce);

    const paymentDetails: IPayment = new Payment({
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
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ error: "Payment processing failed" });
  }
};

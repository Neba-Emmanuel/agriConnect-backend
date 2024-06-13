import { Request, Response } from "express";
import { PaymentOperation, RandomGenerator } from "@hachther/mesomb/lib";
import Payment, { IPayment } from "../models/Payments";
import User from "../models/Users";

interface CustomRequest extends Request {
  user?: any;
}

export const collectPayment = async (req: CustomRequest, res: Response) => {
  const { amount, service, payer } = req.body;

  if (!amount || !service || !payer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Get the authenticated user ID
    const userId = req.user._id;

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const payment = new PaymentOperation({
      applicationKey: process.env.MESOMB_APPLICATION_KEY!,
      accessKey: process.env.MESOMB_ACCESS_KEY!,
      secretKey: process.env.MESOMB_SECRET_KEY!,
    });

    const response = await payment.makeCollect({
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

    await paymentDetails.save();

    return res.status(200).json({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      data: response,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ error: "Payment processing failed" });
  }
};

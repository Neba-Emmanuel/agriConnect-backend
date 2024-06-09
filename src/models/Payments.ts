import mongoose, { Schema, Document } from "mongoose";

interface IPayment extends Document {
  user: Schema.Types.ObjectId;
  amount: number;
  service: string;
  payer: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    service: { type: String, required: true },
    payer: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;
export { IPayment };

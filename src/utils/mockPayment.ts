export interface PaymentResponse {
  operationSuccess: boolean;
  transactionSuccess: boolean;
  data: any;
}

export const makeCollect = async (
  amount: number,
  service: string,
  payer: string,
  nonce: string
): Promise<PaymentResponse> => {
  // Simulate a payment response
  const isSuccess = Math.random() > 0.5; // Random success or failure for demonstration

  return {
    operationSuccess: true,
    transactionSuccess: isSuccess,
    data: {
      amount,
      service,
      payer,
      nonce,
      message: isSuccess ? "Payment Successful" : "Payment Failed",
    },
  };
};

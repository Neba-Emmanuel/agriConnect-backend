"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCollect = void 0;
const makeCollect = async (amount, service, payer, nonce) => {
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
exports.makeCollect = makeCollect;

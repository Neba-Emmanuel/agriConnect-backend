import { Router } from "express";
import { collectPayment } from "../controllers/paymentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/collect", authMiddleware, collectPayment);

export default router;

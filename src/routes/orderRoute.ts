import express from "express";
import { getAllOrders } from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/all", authMiddleware, getAllOrders);

export default router;

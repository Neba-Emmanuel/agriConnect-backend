import { Router } from "express";
import {
  register,
  login,
  getUser,
  logout,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// @route   POST /auth/register
// @desc    Register user
// @access  Public
router.post("/auth/register", register);

// @route   POST /auth/login
// @desc    Login user & get token
// @access  Public
router.post("/auth/login", login);

// @route   GET /user
// @desc    Get user info
// @access  Private
router.get("/user", authMiddleware, getUser);

router.get("/user/logout", logout);

export default router;

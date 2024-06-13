"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await Users_1.default.findById(decoded.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
exports.authMiddleware = authMiddleware;

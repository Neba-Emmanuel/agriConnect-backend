"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getUser = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = __importDefault(require("../models/Users"));
const register = async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;
    try {
        let user = await Users_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        user = new Users_1.default({
            fullName,
            email,
            phoneNumber,
            password,
        });
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        await user.save();
        const payload = { user: { id: user.id } };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await Users_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const payload = { user: { id: user.id } };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
exports.login = login;
const getUser = async (req, res) => {
    try {
        const user = await Users_1.default.findById(req?.user?.id).select("-password");
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
exports.getUser = getUser;
const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ msg: "Logout successful" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
exports.logout = logout;

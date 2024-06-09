"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paymentRoute_1 = __importDefault(require("./routes/paymentRoute"));
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(body_parser_1.default.json());
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Routes
app.use("/api", authRoutes_1.default);
app.use("/api/payment", paymentRoute_1.default);
app.get("/", (req, res) => {
    res.send("pong");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

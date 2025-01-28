"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const route_js_1 = require("./routes/route.js");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 7000;
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use("/api", route_js_1.router);
app.listen(PORT, () => console.log(`Server is ruuning on port ${PORT}`));

import express from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes/route.js";
const app = express();
const PORT = process.env.PORT || 7000;
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use("/api", router);
app.listen(PORT, () => console.log(`Server is ruuning on port ${PORT}`));

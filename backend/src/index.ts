const express = require("express");
const cors = require("cors");
import "dotenv/config";
import { router } from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', "https://parse-pro.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use((req:any, res:any, next:any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// app.use(express.urlencoded({ extended: false }));

app.get("/", (req:any, res:any) => {
  return res.send("It's working 🙌");
});

app.use("/api", router)

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
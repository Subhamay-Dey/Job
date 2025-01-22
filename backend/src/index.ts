import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes/index.js";

const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");
});

app.use("/api", router)

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
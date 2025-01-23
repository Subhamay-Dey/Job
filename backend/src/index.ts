import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes/index.js";

const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors({
  origin: function(origin, callback){
    const allowedOrigins = [
      'http://localhost:3000', 
      'https://parse-pro.vercel.app',
      'https://parsepro-1.onrender.com'
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");
});

app.use("/api", router)

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
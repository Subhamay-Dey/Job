import express, { Application, Request, Response } from "express";
import "dotenv/config";

const app: Application = express();
const PORT = process.env.PORT || 7000;

app.get("/", (req:Request, res:Response) => {
    res.send("Hello World");
})

app.listen(PORT, () => console.log(`Server is ruuning on port ${PORT}`))
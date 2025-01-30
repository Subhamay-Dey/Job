import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { signIn, signUp } from "../auth/auth.js";
import Upload from "../main/Upload.js";
import Nlp from "../main/Nlp.js";

export const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authMiddleware, upload.single('file'), Upload.upload);

router.get('/nlp/:dataId', authMiddleware, Nlp.nlp);

router.post("/signup",signUp)

router.post("/signin",signIn)

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    })
});

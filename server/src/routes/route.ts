import { Router } from "express";
import prisma from "../prisma/prisma.js";
import { nlpService } from "../Controllers/NlpCoontroller.js";
import multer from "multer";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { signIn, signUp } from "../auth/auth.js";
import Upload from "../main/Upload.js";

export const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authMiddleware, upload.single('file'), Upload.upload);

router.get('/nlp/:dataId', authMiddleware, async (req: any, res:any) => {
    const { dataId } = req.params;
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(400).json({
                message: "User not authenticated"
            });
        }

        const data = await prisma.file.findUnique({
            where: {
                id: dataId,
                userId: userId
            },
            include: {
                user: true
            }
        });

        if (!data) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        const text = data.text;
        
        const nlpResult = await nlpService(text);

        res.status(200).json({
            message: "NLP Service success",
            data: nlpResult
        });

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/signup",signUp)

router.post("/signin",signIn)

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    })
});

import { Router } from "express";
import prisma from "../prisma/prisma.js";
import { nlpService } from "../Controllers/NlpCoontroller.js";
import { uploadFile } from "../Controllers/UploadController.js";
import multer from "multer";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { signIn, signUp } from "../auth/auth.js";
import PdfParse from "pdf-parse";
import PdfParsing from "../Controllers/PdfParsing.js";

export const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authMiddleware, upload.single('file'), async (req: any, res:any) => {
    const userId = req.userId;
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file provided"
            });
        }

        if (!req.file?.mimetype || !req.file.mimetype.includes('pdf')) {
            return res.status(400).json({
                message: "Please upload a PDF file"
            });
        }

        if (!userId) {
            return res.status(400).json({
                message: "User not authenticated"
            });
        }

        const uploadedFile = await uploadFile(req.file!);
        const parsedText = await PdfParsing.parse(req.file?.buffer!);

        const newData = await prisma.file.create({
            data: {
                text: parsedText!,
                file: uploadedFile,  // The uploaded file object as JSON
                user: {
                    connect: {
                        id: userId,  // Ensure that req.user.id is valid
                    },
                },
            }
        });

        res.status(200).json({
            data: {
                savedData: newData
            },
            message: "Upload service is working successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

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

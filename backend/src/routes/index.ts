import { Router } from "express";
import UploadController from "../Controllers/UploadController.js";
import upload from "../middleware/multerConfig.js";
import PdfParsing from "../Controllers/PdfParsing.js";
import prisma from "../prisma/index.js";
import { nlpService } from "../Controllers/NlpController.js";

export const router = Router();

router.post("/upload", upload.single("file"), UploadController.upload, PdfParsing.parsePdf);

router.get('/nlp/:dataId', async(req:any,res) => {
    const {dataId} = req.params;
    const userId = req.userId;
    try {

        const data = await prisma.file.findUnique({
            where:{
                id: dataId,
                userId: userId
            }, 
            include:{
                user: true
            }
        });

        const text = data?.text;
        console.log(text);
        const nlpResult = await nlpService(text!);
        
        res.status(200).json({
            message: "NLP Service success",
            data: nlpResult
        })
        
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
})
import { Router } from "express";
// import UploadController from "../Controllers/UploadController.js";
// import upload from "../middleware/multerConfig.js";
import { extractTextFromPdf } from "../Controllers/PdfParsing.js";
import prisma from "../prisma/index.js";
import { nlpService } from "../Controllers/NlpController.js";
import { uploadFile } from "../Controllers/UploadController.js";
import multer from "multer";

export const router = Router();

const upload = multer({storage: multer.memoryStorage()})


// router.post("/upload", upload.single("file"), UploadController.upload, PdfParsing.parsePdf);

router.post('/upload' ,upload.single('file') ,async(req:any,res) => {
    const userId = req.userId;
    try {
        if(!req.file){
            res.status(400).json({
                message: "No file provided"
            })
        }
        if(!req.file?.mimetype || !req.file.mimetype.includes('pdf')){
            res.status(400).json({
                message: "Please uplaod a pdf file"
            })
        }

        const uploadedFile = await uploadFile(req.file!);
        const parsedText = await extractTextFromPdf(req.file?.buffer!)

        const newData = await prisma.file.create({
            data:{
                text: parsedText!,
                file:uploadedFile,
                user:{
                    connect:{
                        id: userId
                    }
                }
            }
        })

        res.status(200).json({
            data: {
                savedData: newData
            },
            message: "Upload service is working sucessfully"
        })
    } catch (error) {   
        console.log("Error: ", error);
    }
})

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
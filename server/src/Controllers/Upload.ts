import { Request, Response } from "express"
import FileUpload from "./FileUpload.js";
import PdfParsing from "./PdfParsing.js";
import prisma from "../prisma/prisma.js";

class Upload {
    static async upload(req: any, res:any) {
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
    
            const uploadedFile = await FileUpload.upload(req.file!);
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
    }
}

export default Upload
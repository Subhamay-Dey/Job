import { Router } from "express";
import UploadController from "../Controllers/UploadController.js";
import upload from "../middleware/multerConfig.js";
import PdfParsing from "../Controllers/PdfParsing.js";
import prisma from "../prisma/index.js";
import { nlpService } from "../Controllers/NlpController.js";

export const router = Router();

router.post("/upload", upload.single("file"), UploadController.upload, PdfParsing.parsePdf);
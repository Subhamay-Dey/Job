import { Router } from "express";
import UploadController from "../Controllers/UploadController.js";
import upload from "../middleware/multerConfig.js";

export const router = Router();

router.post("/upload", upload.single("file"), UploadController.upload)
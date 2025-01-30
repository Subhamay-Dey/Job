import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import Upload from "../main/Upload.js";
import Nlp from "../main/Nlp.js";
import Logout from "../main/Logout.js";
import Signup from "../auth/Signup.js";
import SignIn from "../auth/SignIn.js";

export const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authMiddleware, upload.single('file'), Upload.upload);

router.get('/nlp/:dataId', authMiddleware, Nlp.nlp);

router.post("/signup", Signup.signup)

router.post("/signin", SignIn.signin)

router.get("/logout", Logout.logout);

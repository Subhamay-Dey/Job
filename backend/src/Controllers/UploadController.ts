import { Request, Response } from "express";
import fs from "fs";
import { supabase } from "../supabase/supabase.js";

class UploadController {
  static async upload(req: Request, res: Response) {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filename = `${Date.now()}-${file.originalname}`;
      const filePath = file.path;

      const fileBuffer = fs.readFileSync(filePath);

      const { data, error: uploadError } = await supabase.storage
        .from("Pdf")
        .upload(filename, fileBuffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError.message);
        fs.unlinkSync(filePath);
        return res
          .status(500)
          .json({ error: "Failed to upload file to Supabase" });
      }

      const { data: publicUrl } = supabase.storage
        .from("pdf")
        .getPublicUrl(filename);

      fs.unlinkSync(filePath);

      return res.status(200).json({
        message: "File uploaded successfully",
        fileUrl: publicUrl,
      });
    } catch (error) {
      console.error("Unexpected Error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
}

export default UploadController;

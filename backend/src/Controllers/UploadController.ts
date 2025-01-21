import { Request, Response } from "express";
import fs from "fs";
import { supabase } from "../supabase/supabase.js";

class UploadController {
  static async upload(req: Request, res: Response) {
    try {
      const file = req.file ;
      const filename = `${Date.now()}-${file.originalname}`;
      const filePath = file.path;

      const fileBuffer = fs.readFileSync(filePath);

      const { data, error: uploadError } = await supabase.storage
        .from("pdf")
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.log("Supabase Upload error:", uploadError.message);
        return res
          .status(500)
          .json({ error: "Failed to upload file to Supabase" });
      }

      const { data:publicURL, error:publicURLError } = supabase.storage
        .from("pdf")
        .getPublicUrl(filename);

        if (publicURLError) {
          console.log("Supabase Public URL error:", publicURLError.message);
          return res
            .status(500)
            .json({ error: "Failed to get public URL from Supabase" });
        }

        fs.unlinkSync(filePath);

        return res.status(200).json({message: "File uploaded successfully", fileUrl: publicURL });

    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

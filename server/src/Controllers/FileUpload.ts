import { Request, Response } from "express";
import { supabase } from "../supabase/supabase.js";

interface File {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }

class FileUpload {
    static async upload(file:File) {
        try {
            const filename = `${Date.now()}-${file.originalname}`;
            const buffer = file.buffer;
            const originalname = file.originalname;
            const mimetype = file.mimetype;

            const {error} = await supabase.storage.from("Pdf").upload(
            filename,
            buffer,
            {contentType: mimetype, cacheControl: "3600",});

            if(error) {
                console.error('Supabase Error:', {  
                    message: error.message
                });
                throw error;
            }

            const url = await FileUpload.url(filename)

            return {
                filename: filename,
                url: url,
                originalname: originalname,
            }

        } catch (error) {
            console.error(error.message);
            throw new Error('Failed to upload file to storage');  
        }

    }

    static async url(filename:string) {
        try {
            const {data: { publicUrl }} = await supabase.storage
            .from("Pdf")
            .getPublicUrl(filename);

            return {
                url : publicUrl
            }

        } catch (error) {
            console.error(error.message);
            throw new Error("Failed to get public URL");
        }
    }
}

export default FileUpload;
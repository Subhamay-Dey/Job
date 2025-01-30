import {GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

class NlpService{

    static apiKey: string;
    static genAI: GoogleGenerativeAI;
    static generationConfig: Record<string, any>;
    static model: any;

    constructor() {
        NlpService.apiKey = process.env.GEMINI_KEY!;
        if (NlpService.apiKey) {
          throw new Error("API key for Google Generative AI is missing.");
        }
    
        NlpService.genAI = new GoogleGenerativeAI(NlpService.apiKey);
    
        NlpService.model = NlpService.genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
    
        NlpService.generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        };
      }    

    static async processText(text: string): Promise<any> {
        try {
          const chatSession = NlpService.model.startChat({
            generationConfig: NlpService.generationConfig,
            history: [
              {
                role: "user",
                parts: [
                  {
                    text: `Extract form fields with labels and values in JSON format from this document: ${text}. Please output it in the following structure:\n\n{\n  "fields": [\n    {\n      "label": "Name",\n      "value": "John Doe"\n    },\n    {\n      "label": "Phone",\n      "value": "+1 (620) 130-7224"\n    }\n  ]\n}`,
                  },
                ],
              },
              {
                role: "model",
                parts: [
                  {
                    text: "Output the extracted form fields in a structured JSON format with dynamic labels and values, similar to the example provided.",
                  },
                ],
              },
            ],
          });
    
          const result = await chatSession.sendMessage(text);
          const response = await result.response;
    
          const cleanedData = response.text().replace(/```json|```/g, "").trim();
          return JSON.parse(cleanedData);
        } catch (error) {
          console.error("Error processing text:", error);
          throw new Error("Failed to process text with Google Generative AI.");
        }
      }
}

export default NlpService
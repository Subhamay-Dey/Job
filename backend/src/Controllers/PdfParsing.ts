import pdf from "pdf-parse";

class PdfParsing {

  static async parsePdf(pdfBuffer: Buffer): Promise<string> {
    try {
      const data = await pdf(pdfBuffer);
      return data.text;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw error;
    }
  }
}

export default PdfParsing;
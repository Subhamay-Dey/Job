import pdf from 'pdf-parse';

class PdfParsing {
  static async parsePdf(pdfBuffer: Buffer): Promise<string> {
    try {
        const data = await pdf(pdfBuffer);
        return data.text;
    } catch (error) {
        throw new Error('Error while parsing pdf');
    }
  }
}

export default PdfParsing;
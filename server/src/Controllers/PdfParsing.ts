import pdf from 'pdf-parse';

class PdfParsing {
    static async parse(buffer: Buffer) {
        try {
            const data = await pdf(buffer);
            console.log(data.text);
            
            return data.text;
        } catch (error) {
            console.log('Pdf parsing error:', error);
        }
    }
}

export default PdfParsing
import NlpService from "../Controllers/NlpService";
import prisma from "../prisma/prisma";

class Nlp {
    static async nlp(req: any, res:any){
        const { dataId } = req.params;
        const userId = req.userId;
        try {
            if (!userId) {
                return res.status(400).json({
                    message: "User not authenticated"
                });
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if(user){
                console.log("User exist");
            } else {
                console.log("User not exist");
            }
    
            const data = await prisma.file.findUnique({
                where: {
                    id: dataId,
                    userId: userId
                },
                // include: {
                //     user: true
                // }
            });
    
            if (!data) {
                return res.status(404).json({
                    message: "File not found"
                });
            }
    
            const text = data.text;
            
            const nlpResult = await NlpService.processText(text);
    
            res.status(200).json({
                message: "NLP Service success",
                data: nlpResult
            });
    
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

export default Nlp
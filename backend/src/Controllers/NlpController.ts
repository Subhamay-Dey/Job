class NplController {
    async getNplData(req, res) {
        const { text } = req.body;
        const nplData = await nplService.getNplData(text);
        res.json(nplData);
    }    
}

export default NplController;
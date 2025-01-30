class Logout {
    static async logout(req: any, res: any) {
        res.clearCookie("token");
        res.status(200).json({message: "User logout successfully"});
    }
}

export default Logout
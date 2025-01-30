import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";
import { SigniInSchema } from "../validation/validation";

class SignIn {
    static async signin(req: any, res: any) {
            const { username, password } = SigniInSchema.parse(req.body);
          
            if (!username || !password) {
              return res.status(400).json({
                message: "Invalid input",
              });
            } else {
              try {
                const user = await prisma.user.findUnique({
                  where: {
                    username,
                  },
                });
          
                if (!user) {
                  return res.status(400).json({
                    message: "User not found",
                  });
                }
          
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                  return res.status(400).json({
                    message: "Invalid password",
                  });
                }
          
                const token = jwt.sign(
                  {
                    userId: user.id,
                  },
                  process.env.JWT_SECRET!
                );
          
                return res.status(200).json({
                  message: "User logged in successfully",
                  token,
                });
              } catch (error) {
                res.status(500).json({
                  message: "Internal server error",
                });
              }
            }
    }
}

export default SignIn
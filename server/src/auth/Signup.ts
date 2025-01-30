import prisma from "../prisma/prisma";
import { SignupSchema } from "../validation/validation";
import bcrypt from "bcrypt";

class Signup {
  static async signup(req: any, res: any) {
    const { username, email, password } = SignupSchema.parse(req.body);
    if (!username || !password || !email) {
      return res.status(400).json({
        message: "Invalid input",
      });
    } else {
      try {
        const hashedPass = await bcrypt.hash(password, 10);
        const userExists = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (userExists) {
          res.status(400).json({
            message: "User already exists",
          });
        }

        const user = await prisma.user.create({
          data: {
            username: username,
            email: email,
            password: hashedPass,
          },
        });
        return res.status(201).json({
          message: "User created successfully",
          userId: user?.id,
        });
      } catch (error) {
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  }
}

export default Signup;

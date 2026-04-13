import { compare } from "bcryptjs";
import { prisma } from "../database/prisma";
import jwt from "jsonwebtoken";

interface AuthUserSchema {
  email: string;
  password: string;
}

export class AuthUserService {
  async execute({ email, password }: AuthUserSchema) {
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExists) throw new Error("Usuário ou senha incorretos");

    const passwordMatch = await compare(password, userExists.password);

    if (!passwordMatch) throw new Error("Usuário ou senha incorretos");

    const token = jwt.sign({ userId: userExists.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return { token }
  }
}

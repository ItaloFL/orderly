import { hash } from "bcryptjs";
import { prisma } from "../database/prisma";

interface RegisterUserSchema {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserService {
  async execute({ name, email, password }: RegisterUserSchema) {
    const verifyIfUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (verifyIfUserExist) throw new Error("Esse e-mail já está em uso!");

    const hashPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
  }
}

import { prisma } from "../database/prisma";
import bcrypt from "bcryptjs";

interface ResetPasswordServiceRequest {
  token: string;
  newPassword: string;
}

export class ResetPasswordService {
  async execute({ token, newPassword }: ResetPasswordServiceRequest) {
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user || !user.passwordResetExpires) {
      throw new Error("Token inválido");
    }

    if (user.passwordResetExpires < new Date()) {
      throw new Error("Token expirado");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }
}

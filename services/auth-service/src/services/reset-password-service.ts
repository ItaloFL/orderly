import { prisma } from "../database/prisma";
import bcrypt from "bcryptjs";
import { AppError } from "../errors/AppError/AppError";

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
      throw new AppError("Token inválido");
    }

    if (user.passwordResetExpires < new Date()) {
      throw new AppError("Token expirado");
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

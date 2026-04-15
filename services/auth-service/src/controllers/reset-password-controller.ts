import { Request, Response } from "express";
import { ResetPasswordService } from "../services/reset-password-service";

export class ResetPasswordController {
  async handle(request: Request, response: Response) {
    const { token, newPassword } = request.body;

    const resetPasswordService = new ResetPasswordService();

    await resetPasswordService.execute({
      token,
      newPassword,
    });

    return response.json({
      message: "Senha alterada com sucesso",
    });
  }
}

import { Request, Response } from "express";
import { ForgotPasswordService } from "../services/forgot-password-service";

export class ForgotPasswordController {
  async handle(request: Request, response: Response) {
    const { email } = request.body;

    const forgotPasswordService = new ForgotPasswordService();

    await forgotPasswordService.execute({ email });

    return response.json({
      message: "Pedido de troca de senha efetuada, verifique seu email",
    });
  }
}

import { Request, Response } from "express";
import { RegisterUserService } from "../services/register-user-service";

export class RegisterUserController {
  async handle(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const registerUserService = new RegisterUserService();

    await registerUserService.execute({
      name,
      email,
      password,
    });

    return response.json({
      message: "Usuário criado com sucesso!",
    });
  }
}

import { Request, Response } from "express";
import { AuthUserService } from "../services/auth-user-service";

export class AuthUserController {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    const authUserService = new AuthUserService();

    const token = await authUserService.execute({
      email,
      password,
    });

    return response.json(token);
  }
}

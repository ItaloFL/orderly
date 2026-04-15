import { Router } from "express";
import { RegisterUserController } from "../controllers/register-user-controller";
import { AuthUserController } from "../controllers/auth-user-controller";
import { ForgotPasswordController } from "../controllers/forgot-password-controller";
import { ResetPasswordController } from "../controllers/reset-password-controller";

export const routes = Router();

const registerUserController = new RegisterUserController();
const authUserController = new AuthUserController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

routes.post("/register", registerUserController.handle);
routes.post("/login", authUserController.handle);
routes.post("/forgot-password", forgotPasswordController.handle);
routes.post("/reset-password", resetPasswordController.handle);

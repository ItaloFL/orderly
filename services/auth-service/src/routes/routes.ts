import { Router } from "express";
import { RegisterUserController } from "../controllers/register-user-controller";
import { AuthUserController } from "../controllers/auth-user-controller";

export const routes = Router();

const registerUserController = new RegisterUserController();
const authUserController = new AuthUserController();

routes.post("/register", registerUserController.handle);
routes.post("/login", authUserController.handle);

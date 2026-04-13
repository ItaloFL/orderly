import { Router } from "express";
import { ensureAuthenticateMiddlewate } from "../middlewares/ensureAuthenticateMiddlewate";
import { ListAllOrdersController } from "../controllers/list-all-orders-controller";

const listAllOrdersController = new ListAllOrdersController();

export const routes = Router();

routes.get(
  "orders",
  ensureAuthenticateMiddlewate,
  listAllOrdersController.handle,
);

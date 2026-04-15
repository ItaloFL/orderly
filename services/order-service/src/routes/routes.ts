import { Router } from "express";
import { ListAllOrdersController } from "../controllers/list-all-orders-controller";
import { CreateOrderController } from "../controllers/create-order-controller";
import { GetOrderByIdController } from "../controllers/get-order-by-id-controller";
import { ensureAuthenticateMiddleware } from "../middlewares/ensureAuthenticateMiddleware";
import { UpdateStatusOrderController } from "../controllers/update-status-order-controller";

const listAllOrdersController = new ListAllOrdersController();
const createOrderController = new CreateOrderController();
const getOrderByIdController = new GetOrderByIdController();
const updateStatusOrderController = new UpdateStatusOrderController();

export const routes = Router();

routes.get(
  "/orders",
  ensureAuthenticateMiddleware,
  listAllOrdersController.handle,
);

routes.get(
  "/orders/:id",
  ensureAuthenticateMiddleware,
  getOrderByIdController.handle,
);

routes.post(
  "/orders",
  ensureAuthenticateMiddleware,
  createOrderController.handle,
);

routes.patch(
  "/orders/:id/status",
  ensureAuthenticateMiddleware,
  updateStatusOrderController.handle,
);

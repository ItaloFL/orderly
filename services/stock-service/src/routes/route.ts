
import { Router } from "express";
import { GetStocksByProductIdsController } from "../controllers/get-stocks-by-product-ids-controller";

const routes = Router();

const getStocksByProductIdsController = new GetStocksByProductIdsController();

routes.get("/stock", getStocksByProductIdsController.handle);

export { routes };

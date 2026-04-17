import { Router } from "express";
import multer from "multer";
import { CreateProductController } from "../controllers/create-product-controller";
import { ensureAuthenticateMiddleware } from "../middlewares/ensureAuthenticateMiddleware";
import { ListAllProductsController } from "../controllers/list-all-products-controller";

const productRoutes = Router();

const upload = multer({ storage: multer.memoryStorage() });

const createProductController = new CreateProductController();
const listAllProductsController = new ListAllProductsController();

productRoutes.post(
  "/product",
  upload.single("image"),
  ensureAuthenticateMiddleware,
  createProductController.handle,
);

productRoutes.get(
  "/product",
  ensureAuthenticateMiddleware,
  listAllProductsController.handle,
);

export { productRoutes };

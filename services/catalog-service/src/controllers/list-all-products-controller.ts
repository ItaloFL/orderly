import { Request, Response } from "express";
import { ListAllProductsService } from "../services/list-all-products-service";

export class ListAllProductsController {
  async handle(request: Request, response: Response) {
    const listAllProductsService = new ListAllProductsService();

    const products = await listAllProductsService.execute();

    return response.json(products);
  }
}

import { Request, Response } from "express";
import { GetStocksByProductIdsService } from "../services/get-stocks-by-product-ids-service";

export class GetStocksByProductIdsController {
  async handle(request: Request, response: Response) {
    const ids = request.query.ids as string;

    if (!ids) {
      return response.json({});
    }

    const getStocksService = new GetStocksByProductIdsService();

    const stockMap = await getStocksService.execute(ids);

    return response.json(stockMap);
  }
}

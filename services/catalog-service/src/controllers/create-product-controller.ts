import { Request, Response } from "express";
import { cloudinary } from "../config/cloudinary";
import { CreateProductService } from "../services/create-product-service";

export class CreateProductController {
  async handle(request: Request, response: Response) {
    const { name, price, category, stock } = request.body;

    const image = request.file;

    if (!image) {
      return response
        .status(400)
        .json({ message: "A imagem do produto é obrigatória." });
    }

    try {
      const base64Image = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "orderly_products",
      });

      const imageUrl = result.secure_url;

      const parsedPrice = Number(price);
      const parsedStock = stock ? Number(stock) : 0;

      const createProductService = new CreateProductService();

      const product = await createProductService.execute({
        name,
        price: parsedPrice,
        category,
        stock: parsedStock,
        imageUrl,
      });

      return response.status(201).json(product);
    } catch (error) {
      console.error("Erro no upload ou criação:", error);
      return response
        .status(500)
        .json({ message: "Erro interno ao criar produto." });
    }
  }
}

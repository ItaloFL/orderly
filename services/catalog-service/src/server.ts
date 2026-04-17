import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { AppError } from "./errors/AppError/AppError";
import { productRoutes } from "./routes/routes";

const app = express();
app.use(cors());
app.use(productRoutes);

app.use(express.json());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.code).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      message: `Server Error, ${err.message}`,
    });
  },
);

app.listen(3006, () => {
  console.log("Catalog server is running on port 3006");
});

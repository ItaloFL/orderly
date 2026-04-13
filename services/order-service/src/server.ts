import express from "express";
import { routes } from "./routes/routes";

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3002, () => {
  console.log("server is running on port 3002");
});

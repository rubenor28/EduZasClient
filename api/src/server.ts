import express from "express";
import cors from "cors";
import { BUN_ENV, PORT } from "config";
import { userExpressController } from "presentation/users/controllers";

export const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userExpressController);

if (BUN_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("Server running on port 3000");
  });
}

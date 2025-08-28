import express from "express";
import cors from "cors";
import { PORT } from "config";

import { userController } from "presentation/controllers";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userController);

app.listen(PORT, () => {
  console.log(`\nAPI listening on http://localhost:${PORT}\n`);
});

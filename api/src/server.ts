import express from "express";
import cors from "cors";
import { BUN_ENV, FRONTEND_URL, PORT } from "config";

import { userExpressController } from "presentation/users/controllers";
import { authExpressController } from "presentation/auth/controllers";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/users", userExpressController);
app.use("/auth", authExpressController);

if (BUN_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

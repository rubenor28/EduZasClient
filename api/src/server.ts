import express from "express";
import cors from "cors";
import path from "path";
import { PORT } from "./config";

const app = express();

app.use(express.json());
// app.use(cors());

if (process.env.BUN_ENV === "production") {
  const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");
  app.use(express.static(clientDistPath));
}

app.listen(PORT, () => {
  console.log(`\nAPI listening on http://localhost:${PORT}\n`);
});

import express from "express";
import cors from "cors";
import { PORT } from "./config";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`\nAPI listening on http://localhost:${PORT}\n`);
});

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      domain: path.resolve(__dirname, "src/Domain"),
      application: path.resolve(__dirname, "src/Application"),
      infraestructure: path.resolve(__dirname, "src/Infraestructure"),
    },
  },
});

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "src/infrastructure/react/presentation"),
  envDir: path.resolve(__dirname),
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@application": path.resolve(__dirname, "src/application"),
      "@domain": path.resolve(__dirname, "src/domain"),
      "@dependencies": path.resolve(
        __dirname,
        "src/infrastructure/dependencies",
      ),
      "@infrastructure-fetch": path.resolve(
        __dirname,
        "src/infrastructure/fetch",
      ),
      "@components": path.resolve(
        __dirname,
        "./src/infrastructure/react/presentation/components",
      ),
      "@pages": path.resolve(
        __dirname,
        "./src/infrastructure/react/presentation/pages",
      ),
      "@context": path.resolve(
        __dirname,
        "./src/infrastructure/react/presentation/context",
      ),
    },
  },
});

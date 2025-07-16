import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// no importa enrutadores relativos: usamos loadEnv
export default defineConfig(({ mode }) => {
  // 1. Carga todas las variables (incluyendo las VITE_)
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL debe estar definida en un .env");
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        // 2. Proxy '/api' apuntando a target: apiBaseUrl
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

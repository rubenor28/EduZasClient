import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { 
      "@domain": path.resolve(__dirname, "src/domain"),
      "@application": path.resolve(__dirname, "src/application"),
      "@adapters": path.resolve(__dirname, "src/adapters"),
      "@presentation": path.resolve(__dirname, "src/presentation"),
    }
  }
})

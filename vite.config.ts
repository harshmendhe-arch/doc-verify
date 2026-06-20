import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Forward all /v1/* API calls to FastAPI backend
      "/v1": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
      // Forward health check
      "/health": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/frontend",
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "app.js",
        assetFileNames: "app.[ext]"
      }
    }
  }
});

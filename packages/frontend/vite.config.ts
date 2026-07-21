import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  optimizeDeps: {
    include: ["@interdex/shared"],
  },
  build: {
    commonjsOptions: {
      // @interdex/shared is a linked npm workspace package (compiled to
      // CommonJS for the Node backend) — its resolved path lives outside
      // node_modules, so Rollup's commonjs plugin needs an explicit include
      // pattern to convert its named exports for the ESM frontend bundle.
      include: [/packages\/shared/, /node_modules/],
    },
  },
});

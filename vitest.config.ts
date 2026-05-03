import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const root = path.resolve(__dirname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
    },
  },
  test: {
    root,
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(root, "vitest.setup.ts")],
    include: ["**/*.test.{ts,tsx}"],
    css: false,
    pool: "forks",
    coverage: {
      provider: "v8",
      include: ["lib/**", "services/**", "hooks/**", "components/**"],
      exclude: ["**/*.test.*", "**/index.ts"],
    },
  },
});

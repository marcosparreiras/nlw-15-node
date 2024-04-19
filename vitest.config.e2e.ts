import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["**/*.e2e-spec.ts"],
    setupFiles: "./test/setup-e2e.ts",
  },
});

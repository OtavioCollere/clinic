import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    include: ["./src/infra/http/**/e2e/*.e2e-spec.ts"],
    setupFiles: ["./src/test/setup-e2e.ts"],
  },
});

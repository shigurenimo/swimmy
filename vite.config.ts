import { defineConfig } from "vite-plus"
import { voidPlugin } from "void"
import { voidReact } from "@void/react/plugin"

export default defineConfig({
  lint: {
    ignorePatterns: [
      ".void/**",
      ".void-wrangler.jsonc",
      "dist/**",
      ".wrangler/**",
      "worker-configuration.d.ts",
      "components/ui/**",
      "interface/hooks/use-mobile.ts",
    ],
    plugins: ["typescript", "unicorn", "oxc", "react"],
    categories: { correctness: "error" },
    rules: {
      "no-unused-vars": "error",
      "no-restricted-imports": ["error", { patterns: ["./*", "../*"] }],
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
    },
  },
  fmt: {
    semi: false,
    ignorePatterns: [
      ".claude/**",
      ".void/**",
      ".void-wrangler.jsonc",
      "dist/**",
      ".wrangler/**",
      "worker-configuration.d.ts",
      "components/ui/**",
      "interface/hooks/use-mobile.ts",
    ],
  },

  resolve: { tsconfigPaths: true },
  // Cloudflare Builds already publishes this path.
  environments: { void_worker: { build: { outDir: "dist/server" } } },
  plugins: [voidPlugin(), voidReact()],
})

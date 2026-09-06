import { defineConfig } from "vite-plus"
import vinext from "vinext"
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig({
  lint: {
    ignorePatterns: [
      ".next/**",
      "dist/**",
      ".wrangler/**",
      ".vinext/**",
      "worker-configuration.d.ts",
      "next-env.d.ts",
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
      "dist/**",
      ".wrangler/**",
      ".vinext/**",
      "worker-configuration.d.ts",
      "next-env.d.ts",
      "components/ui/**",
      "interface/hooks/use-mobile.ts",
    ],
  },

  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
})

import { defineConfig } from "vite-plus"

export default defineConfig({
  lint: {
    ignorePatterns: [
      ".next/**",
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
      "next-env.d.ts",
      "components/ui/**",
      "interface/hooks/use-mobile.ts",
    ],
  },
})

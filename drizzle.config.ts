import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    accountId: "5b7537bae3233beb7ebbcdb7f47c3ec0",
    databaseId: "5da58112-3d9b-4780-b26d-2a6fb4f088cc",
    token: process.env.CLOUDFLARE_API_TOKEN ?? "",
  },
})

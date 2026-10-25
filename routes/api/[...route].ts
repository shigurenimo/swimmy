import { defineHandler } from "void"
import { createApiApp } from "@/api/create-api-app"

const app = createApiApp()
export const GET = defineHandler((c) => app.fetch(c.req.raw))
export const POST = defineHandler((c) => app.fetch(c.req.raw))

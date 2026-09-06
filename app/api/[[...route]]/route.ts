import { handle } from "hono/vercel"
import { createApiApp } from "@/interface/api/create-api-app"

const app = createApiApp()

export const GET = handle(app)

export const POST = handle(app)

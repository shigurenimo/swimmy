import { createApiApp } from "@/interface/api/create-api-app"

const app = createApiApp()

export const GET = (request: Request) => app.fetch(request)

export const POST = (request: Request) => app.fetch(request)

import { defineHandler } from "void"
import sitemap from "@/app/sitemap"

export const GET = defineHandler(async (c) => {
  const entries = await sitemap()
  const escape = (value: string) => value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`)
  const xml = entries
    .map(
      (entry) =>
        `<url><loc>${escape(entry.url)}</loc>${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>` : ""}</url>`,
    )
    .join("")
  return c.body(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xml}</urlset>`,
    200,
    { "Content-Type": "application/xml; charset=utf-8" },
  )
})

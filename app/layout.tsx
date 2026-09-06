import type { Metadata } from "next"
import { Providers } from "@/app/providers"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "スイミー電子掲示板",
  description: "Swimmy Application",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

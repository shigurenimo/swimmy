import type { Metadata } from "next"
import { Providers } from "@/app/providers"
import { pageMetadata, siteDescription, siteName, siteUrl } from "@/app/metadata"
import "@/app/globals.css"

export const metadata: Metadata = {
  ...pageMetadata({ description: siteDescription, path: "/" }),
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  icons: { icon: "/favicon.ico", apple: "/icons/apple-touch-icon.png" },
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

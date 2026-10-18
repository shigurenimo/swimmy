import type { ReactNode } from "react"
import { Providers } from "@/app/providers"
import "@/app/globals.css"

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>
}

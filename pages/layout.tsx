import type { ReactNode } from "react"
import { QueryProvider } from "@/components/query-provider"
import "@/styles.css"

export default function RootLayout({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}

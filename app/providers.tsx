"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getAnalytics } from "firebase/analytics"
import { getApps, initializeApp } from "firebase/app"
import { type FC, type ReactNode, useEffect, useState } from "react"
import { firebaseConfig } from "@/lib/firebase"

type Props = {
  children: ReactNode
}

export const Providers: FC<Props> = (props) => {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    const app = getApps()[0] ?? initializeApp(firebaseConfig)
    getAnalytics(app)
  }, [])

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

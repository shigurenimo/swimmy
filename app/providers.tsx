"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getAnalytics } from "firebase/analytics"
import { type FC, type ReactNode, useEffect, useState } from "react"
import { getFirebaseStorage } from "@/lib/firebase-storage"

type Props = {
  children: ReactNode
}

export const Providers: FC<Props> = (props) => {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    getAnalytics(getFirebaseStorage().app)
  }, [])

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

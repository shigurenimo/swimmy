"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type FC, type ReactNode, useState } from "react"

type Props = {
  children: ReactNode
}

export const Providers: FC<Props> = (props) => {
  const [queryClient] = useState(() => new QueryClient())

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

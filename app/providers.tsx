"use client"

import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { type FC, type ReactNode, useState } from "react"

type Props = {
  children: ReactNode
}

export const Providers: FC<Props> = (props) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }),
  )

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}

export function HydrateBoard(props: Props & { state: DehydratedState }) {
  return <HydrationBoundary state={props.state}>{props.children}</HydrationBoundary>
}

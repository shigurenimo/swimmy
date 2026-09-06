import type { FC } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const BoxAsideFeedThreadFallback: FC = () => {
  return (
    <div className="h-full w-full border-l p-4">
      <Skeleton className="mb-4 h-8 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  )
}

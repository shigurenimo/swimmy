import type { FC } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const BoxAsideFeedThreadFallback: FC = () => {
  return (
    <div className="flex h-full w-full flex-col gap-2 border-l p-4">
      <div className="pb-2">
        <Skeleton className="h-8 w-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  )
}

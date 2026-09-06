import type { FC } from "react"
import { BoxCardPostSkeleton } from "@/interface/components/box/box-card-post-skeleton"

const placeholderIds = ["first", "second", "third", "fourth", "fifth"]

export const BoxFeedFallback: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {placeholderIds.map((id) => (
        <BoxCardPostSkeleton key={id} />
      ))}
    </div>
  )
}

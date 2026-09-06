import Image from "next/image"
import type { FC } from "react"

type Props = {
  fileId: string
}

export const BoxImage: FC<Props> = (props) => {
  return (
    <div className="py-2">
      <div className="relative h-32 w-full overflow-hidden rounded-md">
        <Image
          loader={(loaderProps) => {
            const searchParams = new URLSearchParams([
              ["w", `${loaderProps.width}`],
              ["q", `${loaderProps.quality || 75}`],
            ])
            return `/api/images/${loaderProps.src}?${searchParams}`
          }}
          src={props.fileId}
          alt={props.fileId}
          width={640}
          height={640}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

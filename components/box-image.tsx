import type { FC } from "react"

type Props = {
  fileId: string
}

export const BoxImage: FC<Props> = (props) => {
  return (
    <div className="relative h-32 w-full overflow-hidden rounded-md">
      <img
        src={`/api/images/${props.fileId}?w=640&q=75`}
        srcSet={[320, 640, 1280]
          .map((width) => `/api/images/${props.fileId}?w=${width}&q=75 ${width}w`)
          .join(", ")}
        sizes="(min-width: 64rem) 32rem, (min-width: 48rem) 50vw, 100vw"
        loading="lazy"
        decoding="async"
        alt="投稿の添付画像"
        width={640}
        height={640}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

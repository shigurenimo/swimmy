import type { FC } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Props = {
  children: string
}

export const BoxMarkdown: FC<Props> = (props) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.children}</ReactMarkdown>
    </div>
  )
}

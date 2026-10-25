import type { FC } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Props = {
  children: string
}

export const BoxMarkdown: FC<Props> = (props) => {
  return (
    <div className="prose max-w-none prose-code:text-base prose-kbd:text-base prose-pre:text-base prose-table:text-base prose-figcaption:text-base">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.children}</ReactMarkdown>
    </div>
  )
}

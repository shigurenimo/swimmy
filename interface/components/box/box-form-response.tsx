import { captureException } from "@sentry/react"
import { type FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { FormNewPost } from "@/interface/types/form-new-post"

type Props = {
  onCreateResponse(input: FormNewPost): Promise<void>
  isLoading: boolean
}

export const BoxFormResponse: FC<Props> = (props) => {
  const [text, setText] = useState("")
  const [submitError, setSubmitError] = useState(false)

  const isValid = text.trim().length > 0 && text.length <= 280

  const onSubmit = async () => {
    setSubmitError(false)

    try {
      await props.onCreateResponse({ text, fileIds: [] })
      setText("")
    } catch (error) {
      setSubmitError(true)
      captureException(error)
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 border-t p-4">
      <Textarea
        placeholder="返信を書き込む"
        rows={2}
        maxLength={280}
        disabled={props.isLoading}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="resize-none"
      />
      {submitError && (
        <p role="alert" className="text-sm">
          送信できませんでした。時間をおいて、もう一度お試しください。
        </p>
      )}
      {isValid && (
        <Button disabled={props.isLoading} size="sm" className="self-end" onClick={onSubmit}>
          {props.isLoading ? "送信中..." : "返信"}
        </Button>
      )}
    </div>
  )
}

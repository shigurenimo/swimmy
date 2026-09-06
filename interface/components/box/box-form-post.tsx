"use client"

import { type FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { BoxImagePreview } from "@/interface/components/box/box-image-preview"
import { ButtonFile } from "@/interface/components/button/button-file"
import { useFileUploader } from "@/interface/hooks/use-file-uploader"
import type { FormNewPost } from "@/interface/types/form-new-post"

type Props = {
  onCreatePost(input: FormNewPost): Promise<void>
  isLoading: boolean
}

export const BoxFormPost: FC<Props> = (props) => {
  const [text, setText] = useState("")
  const [submitError, setSubmitError] = useState(false)

  const fileUploader = useFileUploader()

  const [fileIds, setFileIds] = useState<string[]>([])

  const isValid = text.trim().length > 0 && text.length <= 280

  const onRemoveFileId = (fileId: string) => {
    setFileIds((current) => current.filter((id) => id !== fileId))
  }

  const onUploadFile = async (file: File) => {
    try {
      const fileId = await fileUploader.mutateAsync(file)
      setFileIds((current) => [...current, fileId])
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async () => {
    setSubmitError(false)

    try {
      await props.onCreatePost({ text, fileIds })
      setText("")
      setFileIds([])
    } catch (error) {
      setSubmitError(true)
      console.error(error)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Textarea
        placeholder="新しい書き込み"
        rows={4}
        maxLength={280}
        disabled={props.isLoading}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      {submitError && (
        <p role="alert" className="text-base">
          送信できませんでした。時間をおいて、もう一度お試しください。
        </p>
      )}
      {isValid && (
        <div className="flex flex-wrap justify-end gap-4">
          <ButtonFile
            variant="secondary"
            onChange={onUploadFile}
            disabled={fileIds.length >= 4}
            loading={props.isLoading || fileUploader.isPending}
          >
            画像
          </ButtonFile>
          <Button disabled={props.isLoading} onClick={onSubmit}>
            {props.isLoading ? "送信中..." : "送信"}
          </Button>
        </div>
      )}
      {fileIds.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {fileIds.map((fileId) => (
            <BoxImagePreview key={fileId} fileId={fileId} onDelete={() => onRemoveFileId(fileId)} />
          ))}
        </div>
      )}
    </div>
  )
}

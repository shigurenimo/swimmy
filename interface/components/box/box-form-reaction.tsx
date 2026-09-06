"use client"

import { type FC, type FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateReactionMutation } from "@/interface/hooks/use-create-reaction-mutation"

type Props = {
  postId: string
  onClose(): void
}

export const BoxFormReaction: FC<Props> = (props) => {
  const [text, setText] = useState("")

  const createReactionMutation = useCreateReactionMutation()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await createReactionMutation.mutateAsync({
        postId: props.postId,
        text: text,
      })
      setText("")
      props.onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-2 flex flex-row items-center gap-2">
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="リアクション (絵文字など)"
        maxLength={8}
        className="h-8 text-xs"
        autoFocus
      />
      <Button type="submit" size="sm" disabled={!text.trim()}>
        送信
      </Button>
      <Button type="button" size="sm" variant="secondary" onClick={props.onClose}>
        キャンセル
      </Button>
    </form>
  )
}

"use client"

import { type FC, type FormEvent, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateReactionMutation } from "@/interface/hooks/use-create-reaction-mutation"

type Props = {
  postId: string
  onClose(): void
}

export const BoxFormReaction: FC<Props> = (props) => {
  const [text, setText] = useState("")
  const submitting = useRef(false)

  const createReactionMutation = useCreateReactionMutation()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting.current || !text.trim()) return
    submitting.current = true

    try {
      await createReactionMutation.mutateAsync({
        postId: props.postId,
        text: text,
      })
      setText("")
      props.onClose()
    } catch (error) {
      console.error(error)
    } finally {
      submitting.current = false
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-row items-center gap-4">
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="リアクション (絵文字など)"
        maxLength={8}
        disabled={createReactionMutation.isPending}
        autoFocus
      />
      <Button type="submit" disabled={!text.trim() || createReactionMutation.isPending}>
        {createReactionMutation.isPending ? "送信中..." : "送信"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={createReactionMutation.isPending}
        onClick={props.onClose}
      >
        キャンセル
      </Button>
    </form>
  )
}

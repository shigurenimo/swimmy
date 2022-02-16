import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { captureException } from "@sentry/react"
import createReaction from "app/home/mutations/createReaction"
import { useMutation } from "blitz"
import { AppPost } from "integrations/types"
import { useSnackbar } from "notistack"
import React, { FunctionComponent, useState } from "react"

type Props = {
  postId: string
  onClose(): void
  onUpdatePost?(post: AppPost): void
}

export const BoxFormReaction: FunctionComponent<Props> = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const [text, setText] = useState("")

  const [createReactionMutation, { isLoading }] = useMutation(createReaction)

  const onCancelReaction = () => {
    if (text !== "") return

    props.onClose()
  }

  const onCreateReaction = async () => {
    try {
      if (text === "") return
      const result = await createReactionMutation({
        text,
        postId: props.postId,
      })
      setText("")
      props.onClose()
      props.onUpdatePost?.(result.post)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  return (
    <Stack direction={"row"} spacing={1}>
      <TextField
        variant={"outlined"}
        size={"small"}
        placeholder={"新しいボタン"}
        value={text}
        onBlur={onCancelReaction}
        onChange={(event) => {
          setText(event.target.value)
        }}
        onClick={(event) => {
          event.stopPropagation()
        }}
      />
      <LoadingButton
        disabled={text === ""}
        loading={isLoading}
        onClick={(event) => {
          event.stopPropagation()
          onCreateReaction()
        }}
      >
        {"追加"}
      </LoadingButton>
    </Stack>
  )
}

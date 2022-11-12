import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { captureException } from "@sentry/react"
import { useSnackbar } from "notistack"
import { FC, useState } from "react"
import { useAddReactionMutation } from "interface/__generated__/react"

type Props = {
  postId: string
  onClose(): void
}

export const BoxFormReaction: FC<Props> = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const [text, setText] = useState("")

  const [addReactionMutation, { loading }] = useAddReactionMutation()

  const onCancelReaction = () => {
    if (text !== "") return

    props.onClose()
  }

  const onCreateReaction = async () => {
    try {
      if (text === "") return
      await addReactionMutation({
        variables: {
          input: {
            text,
            postId: props.postId,
          },
        },
      })
      setText("")
      props.onClose()
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
        loading={loading}
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

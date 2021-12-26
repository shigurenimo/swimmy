import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { captureException } from "@sentry/react"
import { FormNewPost } from "app/threads/types/formNewPost"
import { useSnackbar } from "notistack"
import React, { FunctionComponent, useState } from "react"

type Props = {
  onCreatePost?(input: FormNewPost): Promise<void>
  isLoading: boolean
}

export const BoxFormPost: FunctionComponent<Props> = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const [text, setText] = useState("")

  const isValid = 0 < text.length && text.length < 124

  const onSubmit = async () => {
    try {
      await props.onCreatePost?.({ text })
      setText("")
      enqueueSnackbar("投稿しました")
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  return (
    <Stack
      direction={"row"}
      spacing={2}
      px={2}
      position={"sticky"}
      sx={{
        zIndex: 90,
        top: 16,
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Stack flex={1}>
        <TextField
          placeholder={"新しい書き込み"}
          multiline={!props.isLoading}
          maxRows={4}
          size={"small"}
          disabled={props.isLoading}
          onChange={(event) => {
            setText(event.target.value)
          }}
        />
      </Stack>
      {isValid && (
        <Stack>
          <LoadingButton
            loading={props.isLoading}
            variant={"outlined"}
            sx={{ py: 0.85 }}
            onClick={onSubmit}
          >
            {"送信"}
          </LoadingButton>
        </Stack>
      )}
    </Stack>
  )
}

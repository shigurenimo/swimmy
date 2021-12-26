import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { captureException } from "@sentry/react"
import { FormNewPost } from "app/threads/types/formNewPost"
import { zFormCreatePost } from "app/threads/validations/formCreatePost"
import { useSnackbar } from "notistack"
import React, { FunctionComponent } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

type Props = {
  onCreatePost?(input: FormNewPost): Promise<void>
  isLoading: boolean
}

export const BoxFormPost: FunctionComponent<Props> = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const { register, handleSubmit, formState, reset } = useForm<FormNewPost>({
    resolver: zodResolver(zFormCreatePost),
  })

  const onSubmit: SubmitHandler<FormNewPost> = async (value) => {
    try {
      await props.onCreatePost?.(value)
      reset()
      enqueueSnackbar("投稿しました")
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  console.log("formState", formState.isDirty)
  console.log("formState", formState.isValid)

  return (
    <Stack
      onSubmit={handleSubmit(onSubmit)}
      component={"form"}
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
          {...register("text")}
        />
      </Stack>
      {formState.isValid && (
        <Stack>
          <LoadingButton
            loading={props.isLoading}
            type={"submit"}
            variant={"outlined"}
            sx={{ py: 0.85 }}
          >
            {"送信"}
          </LoadingButton>
        </Stack>
      )}
    </Stack>
  )
}

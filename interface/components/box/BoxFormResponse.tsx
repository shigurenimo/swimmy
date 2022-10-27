import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { useSnackbar } from "notistack"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormNewPost } from "interface/types/formNewPost"

type Props = {
  onCreateResponse(input: FormNewPost): Promise<void>
  isLoading: boolean
}

export const BoxFormResponse: FC<Props> = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const { register, handleSubmit, formState, reset } = useForm<FormNewPost>()

  const onSubmit: SubmitHandler<FormNewPost> = async (value) => {
    try {
      await props.onCreateResponse(value)
      reset()
      enqueueSnackbar("リプライしました")
    } catch (error) {
      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  return (
    <Stack
      onSubmit={handleSubmit(onSubmit)}
      component={"form"}
      direction={"row"}
      spacing={2}
      sx={{ px: 2, pb: 2 }}
    >
      <Stack flex={1}>
        <TextField
          placeholder={"新しい書き込み"}
          multiline
          maxRows={4}
          size={"small"}
          disabled={props.isLoading}
          {...register("text")}
        />
      </Stack>
      <Stack>
        <LoadingButton
          loading={props.isLoading}
          type={"submit"}
          variant={"outlined"}
          sx={{ py: 0.85 }}
        >
          {"リプライ"}
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

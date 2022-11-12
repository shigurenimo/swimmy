import { LoadingButton } from "@mui/lab"
import { Box, Grid, Stack, TextField } from "@mui/material"
import { captureException } from "@sentry/react"
import produce from "immer"
import { useSnackbar } from "notistack"
import { FC, useState } from "react"
import { BoxImagePreview } from "interface/components/box/BoxImagePreview"
import { ButtonFile } from "interface/components/button/ButtonFile"
import { useFileUploader } from "interface/hooks/useFileUploader"
import { FormNewPost } from "interface/types/formNewPost"

type Props = {
  onCreatePost?(input: FormNewPost): Promise<void>
  isLoading: boolean
}

export const BoxFormPost: FC<Props> = (props) => {
  const { enqueueSnackbar } = useSnackbar()

  const [text, setText] = useState("")

  const fileUploader = useFileUploader()

  const [fileIds, setFileIds] = useState<string[]>([])

  const isValid = 0 < text.length && text.length < 124

  const onRemoveFileId = async (fileId: string) => {
    const nextFileIds = produce(fileIds, (draft) => {
      const index = fileIds.findIndex((id) => id === fileId)
      draft.splice(index, 1)
    })
    setFileIds(nextFileIds)
  }

  const onUploadFile = async (file: File) => {
    try {
      const fileId = await fileUploader.mutateAsync(file)
      const nextFileIds = produce(fileIds, (draft) => {
        draft.push(fileId)
      })
      setFileIds(nextFileIds)
    } catch (error) {
      captureException(error)
      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  const onSubmit = async () => {
    try {
      await props.onCreatePost?.({ text, fileIds })
      setText("")
      setFileIds([])
      enqueueSnackbar("投稿しました")
    } catch (error) {
      captureException(error)
      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  return (
    <Stack spacing={2} px={2}>
      <Stack
        direction={"row"}
        spacing={2}
        position={"sticky"}
        sx={{
          zIndex: 90,
          top: 16,
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Stack flex={1} direction={"row"} spacing={2}>
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
            <ButtonFile
              variant={"outlined"}
              onChange={onUploadFile}
              disabled={3 < fileIds.length}
              loading={props.isLoading || fileUploader.isLoading}
            >
              {"画像"}
            </ButtonFile>
          )}
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
      {0 < fileIds.length && (
        <Box>
          <Grid container spacing={2}>
            {fileIds.map((fileId) => (
              <Grid item xs={6} key={fileId}>
                <BoxImagePreview
                  fileId={fileId}
                  onDelete={() => {
                    onRemoveFileId(fileId)
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  )
}

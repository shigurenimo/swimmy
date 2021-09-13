import NearMe from '@mui/icons-material/NearMe'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FunctionComponent, useState } from 'react'
import { useCreateResponse } from 'src/thread/hooks/useCreateResponse'

type Props = { threadId: string }

export const TextFieldResponse: FunctionComponent<Props> = ({ threadId }) => {
  const [text, setText] = useState('')

  const createResponse = useCreateResponse()

  const { enqueueSnackbar } = useSnackbar()

  const onCreateResponse = async () => {
    try {
      await createResponse.mutateAsync({
        fileIds: [],
        replyPostId: threadId,
        text,
      })
      setText('')
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  const isDisabled = createResponse.isLoading || text.match(/\S/g) === null

  return (
    <Stack direction={'row'} spacing={2}>
      <TextField
        disabled={createResponse.isLoading}
        fullWidth
        multiline
        onChange={(event) => {
          if (createResponse.isLoading) return
          setText(event.target.value)
        }}
        placeholder={'新しいコメント'}
        size={'small'}
        value={text}
        variant={'standard'}
      />
      <LoadingButton
        aria-label={'発言する'}
        color={'primary'}
        disabled={isDisabled}
        onClick={onCreateResponse}
        variant={'contained'}
        size={'small'}
        endIcon={<NearMe />}
        loading={createResponse.isLoading}
      >
        {'発言'}
      </LoadingButton>
    </Stack>
  )
}

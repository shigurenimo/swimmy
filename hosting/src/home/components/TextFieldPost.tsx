import NearMe from '@mui/icons-material/NearMe'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FunctionComponent, useState } from 'react'
import { usePlaceholder } from 'src/home/hooks/usePlaceholder'
import { useCreatePost } from 'src/post/hooks/useCreatePost'

export const TextFieldPost: FunctionComponent = () => {
  const [text, setText] = useState('')

  const createPost = useCreatePost()

  const placeholder = usePlaceholder()

  const { enqueueSnackbar } = useSnackbar()

  const onCreatePost = async () => {
    try {
      await createPost.mutateAsync({
        fileIds: [],
        replyPostId: '',
        text,
      })
      setText('')
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  const isDisabled = createPost.isLoading || text.match(/\S/g) === null

  return (
    <Stack direction={'row'} spacing={2}>
      <TextField
        disabled={createPost.isLoading}
        fullWidth
        multiline
        onChange={(event) => {
          if (createPost.isLoading) return
          setText(event.target.value)
        }}
        placeholder={placeholder}
        size={'small'}
        value={text}
        variant={'standard'}
      />
      <LoadingButton
        aria-label={'発言する'}
        color={'primary'}
        disabled={isDisabled}
        onClick={onCreatePost}
        endIcon={<NearMe />}
        loading={createPost.isLoading}
      >
        {'発言'}
      </LoadingButton>
    </Stack>
  )
}

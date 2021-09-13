import InsertPhoto from '@mui/icons-material/InsertPhoto'
import NearMe from '@mui/icons-material/NearMe'
import { LoadingButton } from '@mui/lab'
import { Box, Grid, Stack, TextField } from '@mui/material'
import React, { FunctionComponent, useRef, useState } from 'react'
import { InputFile } from 'src/core/components/InputFile'
import { File } from 'src/core/types/file'
import { useFile } from 'src/photo/hooks/useFile'
import { useCreatePost } from 'src/post/hooks/useCreatePost'

export const TextFieldPhoto: FunctionComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState('')

  const [files, setFiles] = useState<File[]>([])

  const [uploadFile, { isLoading: isLoadingFile }] = useFile((file) => {
    setFiles([...files, file])
  })

  const createPost = useCreatePost()

  const onCreatePost = async () => {
    try {
      await createPost.mutateAsync({
        fileIds: files.map((file) => file.id),
        replyPostId: '',
        text,
      })
      setFiles([])
      setText('')
    } catch (error) {
      console.error(error)
    }
  }

  const isDisabled =
    isLoadingFile ||
    createPost.isLoading ||
    files.length === 0 ||
    text.match(/\S/g) === null

  return (
    <Stack px={2} spacing={2}>
      <Stack direction={'row'} spacing={2}>
        <InputFile
          inputRef={inputRef}
          onChange={(event) => {
            if (event.target.files === null) return
            const [file] = Array.from(event.target.files)
            uploadFile(file)
          }}
        />
        <TextField
          disabled={createPost.isLoading}
          fullWidth
          multiline
          onChange={(event) => {
            if (createPost.isLoading) return
            setText(event.target.value)
          }}
          placeholder={'テキスト'}
          size={'small'}
          value={text}
          variant={'outlined'}
        />
        <LoadingButton
          aria-label={'画像を添付する'}
          disabled={isLoadingFile}
          color={'primary'}
          onClick={() => {
            if (isLoadingFile || !inputRef.current) return
            inputRef.current.click()
          }}
          endIcon={<InsertPhoto />}
          loading={isLoadingFile}
        >
          {'画像'}
        </LoadingButton>
        <LoadingButton
          aria-label={'投稿する'}
          color={'primary'}
          disabled={isDisabled}
          onClick={onCreatePost}
          endIcon={<NearMe />}
          loading={createPost.isLoading}
        >
          {'投稿'}
        </LoadingButton>
      </Stack>
      {files.length !== 0 && (
        <Grid container spacing={2}>
          {files.map((file) => (
            <Box
              component={'img'}
              key={file.id}
              src={`//swimmy.io/images/${file.id}`}
              alt={file.id}
              sx={{ width: `${100}%`, borderRadius: 4 }}
            />
          ))}
        </Grid>
      )}
    </Stack>
  )
}

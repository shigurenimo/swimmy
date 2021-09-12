import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import InsertPhoto from '@material-ui/icons/InsertPhoto'
import NearMe from '@material-ui/icons/NearMe'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useRef, useState } from 'react'
import { InputFile } from 'src/core/components/InputFile'
import { File } from 'src/core/types/file'
import { useFile } from 'src/photo/hooks/useFile'
import { useCreatePost } from 'src/post/hooks/useCreatePost'

export const TextFieldPhoto: FunctionComponent = () => {
  const classes = useStyles()

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
    <section className={classes.root}>
      <div className={classes.input}>
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
        <Button
          aria-label={'Send a post'}
          className={classes.submitButton}
          classes={{ root: classes.buttonRoot }}
          disabled={isLoadingFile}
          color={'primary'}
          onClick={() => {
            if (isLoadingFile || !inputRef.current) return
            inputRef.current.click()
          }}
          variant={'contained'}
        >
          {isLoadingFile ? <CircularProgress size={24} /> : <InsertPhoto />}
        </Button>
        <Button
          aria-label={'Send a post'}
          className={classes.submitButton}
          classes={{ root: classes.buttonRoot }}
          color={'primary'}
          disabled={isDisabled}
          onClick={onCreatePost}
          variant={'contained'}
        >
          {createPost.isLoading ? <CircularProgress size={24} /> : <NearMe />}
        </Button>
      </div>
      {files.length !== 0 && (
        <div className={classes.images}>
          {files.map((file) => (
            <img
              key={file.id}
              className={classes.img}
              src={`//swimmy.io/images/${file.id}`}
              alt={file.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}

const useStyles = makeStyles<Theme>((theme) => {
  return {
    root: {
      display: 'grid',
      gridRowGap: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    input: {
      display: 'grid',
      columnGap: theme.spacing(2),
      gridTemplateColumns: '1fr auto auto',
    },
    buttonRoot: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      minWidth: 0,
    },
    submitButton: { position: 'relative' },
    img: { width: `${100}%`, borderRadius: 4 },
    images: {
      display: 'grid',
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(2),
      gridTemplateColumns: 'repeat(4, 1fr)',
      width: '100%',
    },
  }
})

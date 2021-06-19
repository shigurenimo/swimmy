import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import InsertPhoto from '@material-ui/icons/InsertPhoto'
import NearMe from '@material-ui/icons/NearMe'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useRef, useState } from 'react'
import { InputFile } from '../../common/InputFile'
import { File } from '../../core/types/file'
import { useCreatePost } from '../../post/hooks/useCreatePost'
import { useFile } from '../hooks/useFile'

export const TextFieldPhoto: FunctionComponent = () => {
  const classes = useStyles()

  const inputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState('')

  const [files, setFiles] = useState<File[]>([])

  const [loadingFile, uploadFile] = useFile((file) => {
    setFiles([...files, file])
  })

  const [loadingCreatePost, createPost] = useCreatePost(
    {
      fileIds: files.map((file) => file.id),
      replyPostId: '',
      text,
    },
    () => {
      setFiles([])
      setText('')
    }
  )

  const disabled =
    loadingFile ||
    loadingCreatePost ||
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
          disabled={loadingCreatePost}
          fullWidth
          multiline
          onChange={(event) => {
            if (loadingCreatePost) return
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
          disabled={loadingFile}
          color={'primary'}
          onClick={() => {
            if (loadingFile || !inputRef.current) return
            inputRef.current.click()
          }}
          variant={'contained'}
        >
          {loadingFile ? <CircularProgress size={24} /> : <InsertPhoto />}
        </Button>
        <Button
          aria-label={'Send a post'}
          className={classes.submitButton}
          classes={{ root: classes.buttonRoot }}
          color={'primary'}
          disabled={disabled}
          onClick={createPost}
          variant={'contained'}
        >
          {loadingCreatePost ? <CircularProgress size={24} /> : <NearMe />}
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

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    root: {
      display: 'grid',
      gridRowGap: spacing(2),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
    },
    input: {
      display: 'grid',
      columnGap: spacing(2),
      gridTemplateColumns: '1fr auto auto',
    },
    buttonRoot: {
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      minWidth: 0,
    },
    submitButton: { position: 'relative' },
    img: { width: `${100}%`, borderRadius: 4 },
    images: {
      display: 'grid',
      gridColumnGap: `${spacing(2)}px`,
      gridRowGap: `${spacing(2)}px`,
      gridTemplateColumns: 'repeat(4, 1fr)',
      width: '100%',
    },
  }
})

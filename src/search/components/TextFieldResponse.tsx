import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { createRef, FunctionComponent, useState } from 'react'
import InputFile from '../../common/InputFile'
import { Image } from '../../firestore/types/image'
import { useCreateResponse } from '../hooks/useCreateResponse'
import { useImage } from '../hooks/useImage'

type Props = { threadId: string }

const TextFieldResponse: FunctionComponent<Props> = ({ threadId }) => {
  const classes = useStyles()

  const inputRef = createRef<HTMLInputElement>()

  const [text, setText] = useState('')

  const [images, setImages] = useState<Image[]>([])

  const [inProgressImage, uploadImage] = useImage(image => {
    setImages([...images, image])
  })

  const [inProgressPost, createResponse] = useCreateResponse(
    {
      fileIds: images.map(image => image.id),
      replyPostId: threadId,
      text: text,
    },
    () => {
      setImages([])
      setText('')
    }
  )

  const inProgress = inProgressPost || inProgressImage

  const disabled = inProgress || text.match(/\S/g) === null

  return (
    <section className={classes.root}>
      <div>
        <TextField
          disabled={inProgress}
          fullWidth
          multiline
          onChange={event => {
            if (inProgress) return
            setText(event.target.value)
          }}
          placeholder={'新しいコメント'}
          size={'small'}
          value={text}
          variant={'outlined'}
        />
      </div>
      <div className={classes.actions}>
        <Button
          aria-label={'Add an image to post'}
          color={'primary'}
          disabled={inProgress}
          onClick={() => {
            if (inProgress || !inputRef.current) return
            inputRef.current.click()
          }}
        >
          {'画像添付'}
        </Button>
        <Button
          aria-label={'Send a post'}
          className={classes.submitButton}
          color={'primary'}
          disabled={disabled}
          onClick={createResponse}
          variant={disabled ? 'outlined' : 'contained'}
        >
          {'送信'}
          {inProgressPost && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
      {images.length !== 0 && (
        <div className={classes.images}>
          {images
            .map(image => image.imageURL)
            .map(photoURL => (
              <img
                key={photoURL}
                className={classes.img}
                src={photoURL + '=s400'}
                alt={photoURL}
              />
            ))}
        </div>
      )}
      <InputFile
        inputRef={inputRef}
        onChange={event => {
          if (event.target.files === null) return
          const [file] = Array.from(event.target.files)
          uploadImage(file)
        }}
      />
    </section>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    actions: { textAlign: 'right' },
    buttonProgress: {
      bottom: 0,
      left: 0,
      margin: 'auto',
      position: 'absolute',
      right: 0,
      top: 0,
    },
    root: {
      display: 'grid',
      gridRowGap: `${spacing(1)}px`,
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
    },
    submitButton: { marginLeft: spacing(1), position: 'relative' },
    img: { width: `${100}%`, borderRadius: 4 },
    images: {
      display: 'grid',
      gridColumnGap: `${spacing(2)}px`,
      gridRowGap: `${spacing(2)}px`,
      gridTemplateColumns: 'repeat(4, 1fr)',
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      width: '100%',
    },
  }
})

export default TextFieldResponse

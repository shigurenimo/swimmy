import {
  Button,
  CircularProgress,
  FormControl,
  Input,
  Theme,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useState } from 'react'
import InputFile from '../../components/InputFile'
import { Image } from '../../firestore/types/image'
import { useCreatePost } from '../hooks/useCreatePost'
import { useImage } from '../hooks/useImage'

const TextFieldPost: FunctionComponent = () => {
  const classes = useStyles()

  const inputRef = React.createRef<HTMLInputElement>()

  const [text, setText] = useState('')

  const [images, setImages] = useState<Image[]>([])

  const [inProgressImage, uploadImage] = useImage(image => {
    setImages([...images, image])
  })

  const [inProgressPost, createPost] = useCreatePost(
    {
      fileIds: images.map(image => image.id),
      replyPostId: '',
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
      <InputFile
        inputRef={inputRef}
        onChange={event => {
          if (event.target.files === null) return
          const [file] = Array.from(event.target.files)
          uploadImage(file)
        }}
      />
      <div className={classes.actions}>
        <Button
          aria-label={'Add an image to post'}
          color={'primary'}
          onClick={() => {
            if (inProgress || !inputRef.current) return
            inputRef.current.click()
          }}
          disabled={inProgress}
        >
          {'画像添付'}
        </Button>
        <Button
          color={'primary'}
          aria-label={'Send a post'}
          className={classes.submitButton}
          disabled={disabled}
          variant={'outlined'}
          onClick={createPost}
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
      <FormControl fullWidth>
        <Input
          classes={{ root: classes.textField }}
          disabled={inProgress}
          fullWidth
          id={'textarea'}
          multiline
          onChange={event => {
            if (inProgress) return
            setText(event.target.value)
          }}
          placeholder={'新しい書き込み'}
          value={text}
        />
      </FormControl>
    </section>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    actions: { textAlign: 'right', paddingRight: spacing(1) },
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
      paddingTop: spacing(1),
    },
    submitButton: { marginLeft: spacing(1), position: 'relative' },
    textField: { paddingLeft: spacing(1.5), paddingRight: spacing(1.5) },
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

export default TextFieldPost

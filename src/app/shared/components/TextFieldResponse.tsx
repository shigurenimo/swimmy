import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import InputFile from 'app/shared/components/InputFile'
import { IMAGES } from 'app/shared/firestore/constants/collection'
import { createId } from 'app/shared/firestore/createId'
import { Image } from 'app/shared/firestore/types/image'
import { createPost } from 'app/shared/functions/createPost'
import { firestore, storage } from 'firebase/app'
import React, { useEffect, useState } from 'react'
import { doc, snapToData } from 'rxfire/firestore'
import { put } from 'rxfire/storage'
import { filter } from 'rxjs/operators'

type Props = { threadId: string }

let TextFieldResponse: React.FunctionComponent<Props>
TextFieldResponse = ({ threadId }) => {
  const [postText, setPostText] = useState('')

  const [postImages, setPostImages] = useState<Image[]>([])

  const [postFile, setPostFile] = useState<File | null>(null)

  const [inProgressSubmit, setInProgressSubmit] = useState(false)

  const classes = useStyle({})

  const inProgress = inProgressSubmit || postFile !== null

  useEffect(() => {
    if (!inProgressSubmit) return
    const fileIds = postImages.map(image => image.id)
    const subscription = createPost()({
      fileIds,
      replyPostId: threadId,
      text: postText
    }).subscribe(
      () => {
        // do not change the order
        setInProgressSubmit(false)
        setPostImages([])
        setPostText('')
      },
      err => {
        console.error(err)
        setInProgressSubmit(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [inProgressSubmit, threadId, postImages, postText])

  useEffect(() => {
    if (!postFile) return
    const fileId = createId()
    const ref = storage().ref(`posts/${fileId}`)
    put(ref, postFile).subscribe()
    const subscription = doc(
      firestore()
        .collection(IMAGES)
        .doc(fileId)
    )
      .pipe(filter(imageSnap => imageSnap.exists))
      .subscribe(imageSnap => {
        subscription.unsubscribe()
        const image = snapToData(imageSnap) as Image
        const _postImages = [...postImages, image]
        setPostFile(null)
        setPostImages(_postImages)
      })
    return () => subscription.unsubscribe()
  }, [postFile, postImages])

  const inputFileRef = React.createRef<HTMLInputElement>()

  const disabled = inProgress || postText.match(/\S/g) === null

  const photoURLs = postImages.map(image => image.imageURL)

  return (
    <section className={classes.root}>
      <div>
        <TextField
          fullWidth
          multiline
          onChange={event => {
            if (inProgress) return
            setPostText(event.target.value)
          }}
          value={postText}
          disabled={inProgress}
          placeholder={'新しいコメント'}
          variant={'outlined'}
        />
      </div>
      <div className={classes.actions}>
        <Button
          aria-label={'Add an image to post'}
          color={'primary'}
          onClick={() => {
            if (inProgress || !inputFileRef.current) return
            inputFileRef.current.click()
          }}
          disabled={inProgress}
        >
          {'画像添付'}
        </Button>
        <Button
          aria-label={'Send a post'}
          className={classes.submitButton}
          color={'primary'}
          disabled={disabled}
          onClick={() => setInProgressSubmit(true)}
          variant={disabled ? 'outlined' : 'contained'}
        >
          {'送信'}
          {inProgressSubmit && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
      {postImages.length !== 0 && (
        <div className={classes.images}>
          {photoURLs.map(photoURL => (
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
        inputRef={inputFileRef}
        onChange={event => {
          if (event.target.files === null) return
          const [file] = Array.from(event.target.files)
          setPostFile(file)
        }}
      />
    </section>
  )
}

const useStyle = makeStyles<Theme>(({ spacing }) => {
  return {
    actions: { textAlign: 'right' },
    buttonProgress: {
      bottom: 0,
      left: 0,
      margin: 'auto',
      position: 'absolute',
      right: 0,
      top: 0
    },
    root: {
      display: 'grid',
      gridRowGap: `${spacing(1)}px`,
      paddingLeft: spacing(2),
      paddingRight: spacing(2)
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
      width: '100%'
    }
  }
})

export default TextFieldResponse

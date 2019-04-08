import {
  Button,
  CircularProgress,
  FormControl,
  Input,
  InputLabel
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { firestore, storage } from 'firebase/app'
import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState
} from 'react'
import { doc, snapToData } from 'rxfire/firestore'
import { put } from 'rxfire/storage'
import { filter } from 'rxjs/operators'
import { IMAGES } from '../constants/collection'
import { createPost } from '../helpers/createPost'
import { useSubscription } from '../hooks/useSubscription'
import { createId } from '../libs/createId'
import InputFile from './InputFile'

type Props = { replyPostId?: string }

const TextFieldPost: FunctionComponent<Props> = ({ replyPostId = '' }) => {
  const [postText, setPostText] = useState('')
  const [postImages, setPostImages] = useState<any[]>([])
  const [inProgressImage, setInProgressImage] = useState(false)
  const [inProgressSubmit, setInProgressSubmit] = useState(false)
  const [subscriptionCreatePost, setSubscriptionCreatePost] = useSubscription()
  const [subscriptionImage, setSubscriptionImage] = useSubscription()
  const inputFileRef = React.createRef()
  const classes = useStyle({})
  const inProgress = inProgressSubmit || inProgressImage
  const disabled = inProgress || postText.match(/\S/g) === null
  const onChangePostText = (event: ChangeEvent<any>) => {
    event.persist()
    setPostText(event.target.value)
  }
  const onSelectImage = () => {
    if (inProgressSubmit || inProgressImage) {
      return
    }
    if (inputFileRef.current) {
      const current = inputFileRef.current as any
      current.click()
    }
  }
  const onChangeImage = (event: ChangeEvent<any>) => {
    if (inProgressSubmit || inProgressImage) {
      return
    }
    const [file] = event.target.files
    const fileId = createId()
    const ref = storage().ref(`posts/${fileId}`)
    setInProgressImage(true)
    const file$ = put(ref, file)
    file$.subscribe()
    const imageRef = firestore()
      .collection(IMAGES)
      .doc(fileId)
    const subscription = doc(imageRef)
      .pipe(filter(imageSnap => imageSnap.exists))
      .subscribe(imageSnap => {
        subscription.unsubscribe()
        const image = snapToData(imageSnap as any)
        const _postImages = [...postImages, image]
        setInProgressImage(false)
        setPostImages(_postImages)
      })
    setSubscriptionImage(subscription)
  }
  const onSubmitPost = () => {
    if (disabled) {
      return
    }
    setInProgressSubmit(true)
    const fileIds = postImages.map(image => image.id)
    const subscription = createPost({
      fileIds,
      replyPostId,
      text: postText
    }).subscribe(
      () => {
        setInProgressSubmit(false)
        setPostImages([])
        setPostText('')
      },
      err => {
        console.error(err)
        setInProgressSubmit(false)
      }
    )
    setSubscriptionCreatePost(subscription)
  }

  useEffect(() => {
    return () => {
      subscriptionCreatePost.unsubscribe()
      subscriptionImage.unsubscribe()
    }
  }, [])

  const photoURLs = postImages.map(image => image.imageURL)

  return (
    <section className={classes.root}>
      <InputFile inputRef={inputFileRef} onChange={onChangeImage} />
      <div className={classes.actions}>
        <Button
          aria-label={'Add an image to post'}
          color={'primary'}
          onClick={onSelectImage}
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
          onClick={onSubmitPost}
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
      <FormControl fullWidth>
        <InputLabel
          htmlFor="textarea"
          classes={{ root: classes.textFieldLabel }}
        >
          {'新しい書き込み'}
        </InputLabel>
        <Input
          id={'textarea'}
          classes={{ root: classes.textField }}
          fullWidth
          multiline
          onChange={onChangePostText}
          value={postText}
          disabled={inProgress}
        />
      </FormControl>
    </section>
  )
}

const useStyle = makeStyles(({ spacing }) => {
  return {
    actions: { textAlign: 'right', paddingRight: spacing(1) },
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
      paddingTop: spacing(1)
    },
    submitButton: { marginLeft: spacing(1), position: 'relative' },
    textField: { paddingLeft: spacing(1.5), paddingRight: spacing(1.5) },
    textFieldLabel: { paddingLeft: spacing(1.5), paddingRight: spacing(1.5) },
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

export default TextFieldPost

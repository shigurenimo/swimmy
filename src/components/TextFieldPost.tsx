import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
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
import { from } from 'rxjs'
import { filter } from 'rxjs/operators'
import { IMAGES } from '../constants/collection'
import { useSubscription } from '../hooks/useSubscription'
import { createId } from '../libs/createId'
import { createPost } from '../libs/createPost'
import { px } from '../libs/styles/px'
import InputFile from './InputFile'
import PreviewImages from './previewImages'

interface Props {
  replyPostId?: string
}

interface State {
  postText: string
  postImages: any[]
  inProgressSubmit: boolean
  inProgressImage: boolean
}

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
    const subscription = from(
      createPost({ fileIds, replyPostId, text: postText })
    ).subscribe(
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
          IMAGE
        </Button>
        <Button
          color={'primary'}
          aria-label={'Send a post'}
          className={classes.submitButton}
          disabled={disabled}
          variant={disabled ? 'text' : 'contained'}
          onClick={onSubmitPost}
        >
          GO
          {inProgressSubmit && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
      {postImages.length !== 0 && (
        <PreviewImages photoURLs={postImages.map(image => image.imageURL)} />
      )}
      <FormControl fullWidth>
        <InputLabel
          htmlFor="textarea"
          classes={{ root: classes.textFieldLabel }}
        >
          新しい書き込み
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
    actions: { textAlign: 'right', paddingRight: spacing.unit },
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
      gridRowGap: px(spacing.unit),
      paddingTop: spacing.unit
    },
    submitButton: { marginLeft: spacing.unit, position: 'relative' },
    textField: {
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5
    },
    textFieldLabel: {
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5
    }
  }
})

export default TextFieldPost

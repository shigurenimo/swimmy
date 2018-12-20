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
  useMemo,
  useState
} from 'react'
import { doc, snapToData } from 'rxfire/firestore'
import { put } from 'rxfire/storage'
import { from, Subscription } from 'rxjs'
import { IMAGES } from '../constants/collection'
import { useSubscriptionMap } from '../hooks/useSubscriptionMap'
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

const TextFieldPost: FunctionComponent<Props> = props => {
  const { replyPostId = '' } = props

  const [state, setState] = useState<State>({
    inProgressImage: false,
    inProgressSubmit: false,
    postImages: [],
    postText: ''
  })

  const subscription = useSubscriptionMap(['createPost', 'image'])

  const inputFileRef = React.createRef()

  const classes = useStyle({})

  const inProgress = state.inProgressSubmit || state.inProgressImage

  const disabled = inProgress || state.postText.match(/\S/g) === null

  const onChangePostText = (event: ChangeEvent<any>) => {
    event.persist()
    setState({ ...state, postText: event.target.value })
  }

  const onSelectImage = () => {
    if (state.inProgressSubmit || state.inProgressImage) {
      return
    }
    if (inputFileRef.current) {
      const current = inputFileRef.current as any
      current.click()
    }
  }

  const onChangeImage = (event: ChangeEvent<any>) => {
    if (state.inProgressSubmit || state.inProgressImage) {
      return
    }
    const [file] = event.target.files
    const fileId = createId()
    const ref = storage().ref(`posts/${fileId}`)
    setState({ ...state, inProgressImage: true })
    const file$ = put(ref, file)
    file$.subscribe()
    const imageRef = firestore()
      .collection(IMAGES)
      .doc(fileId)
    const image$$ = doc(imageRef).subscribe(imageSnap => {
      if (!imageSnap.exists) {
        return
      }
      image$$.unsubscribe()
      const image = snapToData(imageSnap as any)
      const postImages = [...state.postImages, image]
      setState({ ...state, inProgressImage: false, postImages })
    })
    subscription.set('image', image$$)
  }

  const onSubmitPost = () => {
    if (disabled) {
      return
    }
    setState({ ...state, inProgressSubmit: true })
    const fileIds = state.postImages.map(image => image.id)
    const createPost$$ = from(
      createPost({ fileIds, replyPostId, text: state.postText })
    ).subscribe(
      () => {
        setState({
          ...state,
          inProgressSubmit: false,
          postImages: [],
          postText: ''
        })
      },
      err => {
        console.error(err)
        setState({ ...state, inProgressSubmit: false })
      }
    )
    subscription.set('createPost', createPost$$)
  }

  useEffect(() => {
    return () => subscription.forEach(i => i.unsubscribe())
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
          {state.inProgressSubmit && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
      {state.postImages.length !== 0 && (
        <PreviewImages
          photoURLs={state.postImages.map(image => image.imageURL)}
        />
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
          value={state.postText}
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

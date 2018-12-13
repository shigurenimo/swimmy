import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel/InputLabel'
import { makeStyles } from '@material-ui/styles'
import { firestore, storage } from 'firebase/app'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { doc, snapToData } from 'rxfire/firestore'
import { put } from 'rxfire/storage'
import { IMAGES } from '../constants/collection'
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
    postText: '',
    postImages: [],
    inProgressSubmit: false,
    inProgressImage: false
  })
  const inputFileRef = React.createRef()
  const classes = useStyle({})
  const inProgress = state.inProgressSubmit || state.inProgressImage

  const disabled = () => {
    const inProgress = state.inProgressSubmit || state.inProgressImage

    return inProgress || state.postText.match(/\S/g) === null
  }

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
    const image$ = doc(imageRef)
    const image$$ = image$.subscribe(imageSnap => {
      if (!imageSnap.exists) return
      image$$.unsubscribe()
      const image = snapToData(imageSnap as any)
      const postImages = [...state.postImages, image]
      setState({ ...state, inProgressImage: false, postImages })
    })
  }

  const onSubmitPost = () => {
    if (disabled()) return

    setState({ ...state, inProgressSubmit: true })

    const fileIds = state.postImages.map(image => image.id)

    createPost({ fileIds, text: state.postText, replyPostId })
      .then(() => {
        setState({
          ...state,
          postText: '',
          postImages: [],
          inProgressSubmit: false
        })
      })
      .catch(err => {
        console.error(err)
        setState({ ...state, inProgressSubmit: false })
      })
  }

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
          disabled={disabled()}
          variant={disabled() ? 'text' : 'contained'}
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
    root: {
      paddingTop: spacing.unit,
      display: 'grid',
      gridRowGap: px(spacing.unit)
    },
    actions: { textAlign: 'right', paddingRight: spacing.unit },
    textField: {
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5
    },
    textFieldLabel: {
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5
    },
    submitButton: { marginLeft: spacing.unit, position: 'relative' },
    buttonProgress: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto'
    }
  }
})

export default TextFieldPost

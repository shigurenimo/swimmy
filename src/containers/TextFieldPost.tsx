import { Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel/InputLabel'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { WithStyles } from '@material-ui/styles/withStyles'
import { firestore, storage } from 'firebase/app'
import React, { ChangeEvent, Component } from 'react'
import { doc, snapToData } from 'rxfire/firestore'
import { put } from 'rxfire/storage'
import InputFile from '../components/InputFile'
import PreviewImages from '../components/previewImages'
import { IMAGES } from '../constants/collection'
import { createId } from '../libs/createId'
import { createPost } from '../libs/createPost'
import { px } from '../libs/styles/px'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: {
      paddingTop: spacing.unit,
      display: 'grid',
      gridRowGap: px(spacing.unit)
    },
    actions: {
      textAlign: 'right',
      paddingRight: spacing.unit
    },
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
  })
}

interface Props extends WithStyles<typeof styles> {
  replyPostId?: string
}

interface State {
  postText: string
  postImages: any[]
  inProgressSubmit: boolean
  inProgressImage: boolean
}

class TextFieldPost extends Component<Props, State> {
  public state: State = {
    postText: '',
    postImages: [],
    inProgressSubmit: false,
    inProgressImage: false
  }
  private isUnmounted = false
  private inputFileRef = React.createRef()

  public render() {
    const { classes } = this.props
    const {
      postText,
      postImages,
      inProgressSubmit,
      inProgressImage
    } = this.state
    const inProgress = inProgressSubmit || inProgressImage

    return (
      <section className={classes.root}>
        <InputFile inputRef={this.inputFileRef} onChange={this.onChangeImage} />
        <div className={classes.actions}>
          <Button
            aria-label={'Add an image to post'}
            color={'primary'}
            onClick={this.onSelectImage}
            disabled={inProgress}
          >
            IMAGE
          </Button>
          <Button
            color={'primary'}
            aria-label={'Send a post'}
            className={classes.submitButton}
            disabled={this.disabled()}
            variant={this.disabled() ? 'text' : 'contained'}
            onClick={this.onSubmitPost}
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
            onChange={this.onChangePostText}
            value={postText}
            disabled={inProgress}
          />
        </FormControl>
      </section>
    )
  }

  public componentWillUnmount() {
    this.isUnmounted = true
  }

  private disabled = () => {
    const { postText, inProgressSubmit, inProgressImage } = this.state
    const inProgress = inProgressSubmit || inProgressImage

    return inProgress || postText.match(/\S/g) === null
  }

  private onChangePostText = (event: ChangeEvent<any>) => {
    event.persist()
    this.setState({ postText: event.target.value })
  }

  private onSelectImage = () => {
    const { inProgressSubmit, inProgressImage } = this.state

    if (inProgressSubmit || inProgressImage) {
      return
    }

    if (this.inputFileRef.current) {
      ;(this.inputFileRef.current as any).click()
    }
  }

  private onChangeImage = (event: ChangeEvent<any>) => {
    const { inProgressSubmit, inProgressImage } = this.state

    if (inProgressSubmit || inProgressImage) {
      return
    }

    const [file] = event.target.files

    const fileId = createId()
    const ref = storage().ref(`posts/${fileId}`)

    this.setState({ inProgressImage: true })

    const file$ = put(ref, file)

    file$.subscribe()

    const imageRef = firestore()
      .collection(IMAGES)
      .doc(fileId)

    const image$ = doc(imageRef)

    const image$$ = image$.subscribe(imageSnap => {
      if (!imageSnap.exists) return
      image$$.unsubscribe()
      if (this.isUnmounted) return
      const image = snapToData(imageSnap as any)
      this.setState(state => {
        const postImages = [...state.postImages, image]
        return { inProgressImage: false, postImages }
      })
    })
  }

  private onSubmitPost = () => {
    const { replyPostId = '' } = this.props
    const { postText, postImages } = this.state as State

    if (this.disabled()) return

    this.setState({ inProgressSubmit: true })

    const fileIds = postImages.map(image => image.id)

    createPost({ fileIds, text: postText, replyPostId })
      .then(() => {
        if (this.isUnmounted) return
        this.setState({
          postText: '',
          postImages: [],
          inProgressSubmit: false
        })
      })
      .catch(err => {
        console.error(err)
        if (this.isUnmounted) return
        this.setState({ inProgressSubmit: false })
      })
  }
}

export default withStyles(styles)(TextFieldPost)

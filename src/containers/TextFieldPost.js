import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore, storage } from 'firebase/app'
import React from 'react'
import { doc, snapToData } from 'rxfire/firestore'
import { put } from 'rxfire/storage'
import { InputFile } from '../components/InputFile'
import { PreviewImages } from '../components/previewImages'
import { IMAGES } from '../constants/collection'
import { createId } from '../libs/createId'
import { createPost } from '../libs/createPost'
import { px } from '../libs/styles/px'

class Component extends React.Component {
  isUnmounted = false
  state = {
    postText: '',
    postImages: [],
    inProgressSubmit: false,
    inProgressImage: false
  }
  inputFileRef = React.createRef()

  disabled = () => {
    const { postText, inProgressSubmit, inProgressImage } = this.state
    const inProgress = inProgressSubmit || inProgressImage

    return inProgress || postText.match(/\S/g) === null
  }

  onChangePostText = event => {
    event.persist()
    this.setState({ postText: event.target.value })
  }

  onSelectImage = () => {
    const { inProgressSubmit, inProgressImage } = this.state

    if (inProgressSubmit || inProgressImage) {
      return
    }

    this.inputFileRef.current.click()
  }

  onChangeImage = event => {
    const { inProgressSubmit, inProgressImage } = this.state

    if (inProgressSubmit || inProgressImage) {
      return
    }

    const [file] = event.target.files

    const fileId = createId()
    const ref = storage().ref(`posts/${fileId}`)

    this.setState({ inProgressImage: true })

    console.log('fileId', fileId)

    const file$ = put(ref, file)

    file$.subscribe(res => {
      console.log('file$', res)
    })

    const imageRef = firestore()
      .collection(IMAGES)
      .doc(fileId)

    const image$ = doc(imageRef)

    const image$$ = image$.subscribe(imageSnap => {
      if (!imageSnap.exists) return
      image$$.unsubscribe()
      if (this.isUnmounted) return
      const image = snapToData(imageSnap)
      console.log('image', image)
      this.setState(state => {
        console.log('state', state)
        const postImages = [...state.postImages, image]
        return { inProgressImage: false, postImages }
      })
    })
  }

  onSubmitPost = () => {
    const { replyPostId = '' } = this.props
    const { postText, postImages } = this.state

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

  render() {
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
            aria-label={'Add an user name to post'}
            color={'primary'}
            disabled={true}
          >
            PUBLIC
          </Button>
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
        <label className={classes.label}>Text</label>
        <FormControl fullWidth>
          <Input
            classes={{ root: classes.textField }}
            placeholder="新しい書き込み"
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

  componentWillUnmount() {
    this.isUnmounted = true
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: {
      marginTop: spacing.unit,
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
    submitButton: { marginLeft: spacing.unit, position: 'relative' },
    buttonProgress: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto'
    },
    label: { display: 'none' }
  })

export const TextFieldPost = withStyles(styles)(Component)

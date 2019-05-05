import { Button, CircularProgress, TextField, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from 'react'
import { createPost } from '../helpers/createPost'
import { useSubscription } from '../hooks/useSubscription'

type Props = { postId: string }

const TextFieldReplyPost: FunctionComponent<Props> = ({ postId }) => {
  const classes = useStyles({})
  const [postText, setPostText] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const [subscription, setSubscription] = useSubscription()
  const onChangePostText = (event: ChangeEvent<any>) => {
    event.persist()
    setPostText(event.target.value)
  }
  const onSubmitPost = () => {
    if (!postText || inProgress) {
      return
    }
    setInProgress(true)
    const createPost$$ = createPost({
      fileIds: [],
      replyPostId: postId,
      text: postText
    }).subscribe(
      () => {
        setPostText('')
        setInProgress(false)
      },
      err => {
        console.error(err)
        setInProgress(false)
      }
    )
    setSubscription(createPost$$)
  }

  useEffect(() => {
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Fragment>
      <div className={classes.root}>
        <TextField
          fullWidth
          className={classes.textField}
          placeholder={'新しいレス'}
          value={postText}
          onChange={onChangePostText}
          disabled={inProgress}
        />
      </div>
      <div className={classes.actions}>
        <Button
          color={'primary'}
          className={classes.submitButton}
          disabled={!postText || inProgress}
          variant={postText ? 'contained' : 'text'}
          onClick={onSubmitPost}
          aria-label={'Send a reply'}
        >
          {'送信'}
          {inProgress && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    actions: {
      marginTop: spacing(1),
      paddingBottom: spacing(1),
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      textAlign: 'right'
    },
    buttonProgress: {
      bottom: 0,
      left: 0,
      margin: 'auto',
      position: 'absolute',
      right: 0,
      top: 0
    },
    root: { width: `${100}%` },
    submitButton: { marginLeft: spacing(1), position: 'relative' },
    textField: {
      paddingLeft: spacing(1.5),
      paddingRight: spacing(1.5)
    }
  }
})

export default TextFieldReplyPost

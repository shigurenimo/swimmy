import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/es/Button'
import TextField from '@material-ui/core/es/TextField'
import { makeStyles } from '@material-ui/styles'
import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from 'react'
import { from } from 'rxjs'
import { useSubscription } from '../hooks/useSubscription'
import { createPost } from '../libs/createPost'
import { pct } from '../libs/styles/pct'

interface Props {
  postId: string
}

const TextFieldReplyPost: FunctionComponent<Props> = ({ postId }) => {
  useEffect(() => {
    return () => subscription.unsubscribe()
  }, [])

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
    const createPost$$ = from(
      createPost({ fileIds: [], replyPostId: postId, text: postText })
    ).subscribe(
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

  return (
    <Fragment>
      <div className={classes.root}>
        <TextField
          fullWidth
          className={classes.textField}
          placeholder="新しいレス"
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
          GO
          {inProgress && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
    </Fragment>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    actions: {
      marginTop: spacing.unit,
      paddingBottom: spacing.unit,
      paddingLeft: spacing.unit,
      paddingRight: spacing.unit,
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
    root: { width: pct(100) },
    submitButton: { marginLeft: spacing.unit, position: 'relative' },
    textField: {
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5
    }
  }
})

export default TextFieldReplyPost

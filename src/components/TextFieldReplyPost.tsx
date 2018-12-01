import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Button from '@material-ui/core/es/Button'
import TextField from '@material-ui/core/es/TextField'
import { makeStyles } from '@material-ui/styles'
import React, { ChangeEvent, Fragment, SFC, useState } from 'react'
import { createPost } from '../libs/createPost'
import { pct } from '../libs/styles/pct'

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: { width: pct(100) },
    textField: {
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5
    },
    actions: {
      marginTop: spacing.unit,
      paddingLeft: spacing.unit,
      paddingRight: spacing.unit,
      paddingBottom: spacing.unit,
      textAlign: 'right'
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

interface Props {
  postId: string
}

const TextFieldReplyPost: SFC<Props> = props => {
  const { postId } = props
  const classes = useStyles({})
  const [postText, setPostText] = useState('')
  const [inProgress, setInProgress] = useState(false)

  const onChangePostText = (event: ChangeEvent<any>) => {
    event.persist()
    setPostText(event.target.value)
  }

  const onSubmitPost = () => {
    if (!postText || inProgress) return

    setInProgress(true)

    createPost({ fileIds: [], text: postText, replyPostId: postId })
      .then(() => {
        setPostText('')
        setInProgress(false)
      })
      .catch(err => {
        console.error(err)
        setInProgress(false)
      })
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

export default TextFieldReplyPost

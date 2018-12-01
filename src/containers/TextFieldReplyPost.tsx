import { Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Button from '@material-ui/core/es/Button'
import TextField from '@material-ui/core/es/TextField'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { WithStyles } from '@material-ui/styles/withStyles'
import React, { ChangeEvent, Component, Fragment } from 'react'
import { createPost } from '../libs/createPost'
import { pct } from '../libs/styles/pct'

const styles = ({ spacing }: Theme) => {
  return createStyles({
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
  })
}

interface Props extends WithStyles<typeof styles> {
  postId: string
}

interface State {
  postText: string
  inProgress: boolean
}

class TextFieldReplyPost extends Component<Props, State> {
  state = { postText: '', inProgress: false }

  onChangePostText = (event: ChangeEvent<any>) => {
    event.persist()
    this.setState({ postText: event.target.value })
  }

  onSubmitPost = () => {
    const { postId } = this.props
    const { postText, inProgress } = this.state

    if (!postText || inProgress) return

    this.setState({ inProgress: true })

    createPost({
      fileIds: [],
      text: postText,
      replyPostId: postId
    })
      .then(() => {
        this.setState({ postText: '', inProgress: false })
      })
      .catch(err => {
        console.error(err)
        this.setState({ inProgress: false })
      })
  }

  render() {
    const { classes } = this.props
    const { postText, inProgress } = this.state

    return (
      <Fragment>
        <div className={classes.root}>
          <TextField
            fullWidth
            className={classes.textField}
            placeholder="新しいレス"
            value={postText}
            onChange={this.onChangePostText}
            disabled={inProgress}
          />
        </div>
        <div className={classes.actions}>
          <Button
            color={'primary'}
            className={classes.submitButton}
            disabled={!postText || inProgress}
            variant={postText ? 'contained' : 'text'}
            onClick={this.onSubmitPost}
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
}

export default withStyles(styles)(TextFieldReplyPost)

import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Button from '@material-ui/core/es/Button'
import TextField from '@material-ui/core/es/TextField'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Fragment } from 'react'
import { createPost } from '../libs/createPost'

class Component extends React.Component {
  state = {
    postText: '',
    inProgress: false
  }
  onChangePostText = event => {
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
            placeholder="リプライ"
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

const styles = ({ spacing }) =>
  createStyles({
    root: { width: '100%' },
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

export const PostAsReplyTextField = withStyles(styles)(Component)

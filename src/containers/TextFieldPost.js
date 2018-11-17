import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import { createPost } from '../libs/createPost'

class Component extends React.Component {
  isUnmounted = false
  state = { postText: '', inProgressPosts: false }

  disabled = () => {
    const { postText, inProgress } = this.state

    return inProgress || postText.match(/\S/g) === null
  }

  onChangePostText = event => {
    event.persist()
    this.setState({ postText: event.target.value })
  }

  onSubmitPost = () => {
    const { replyPostId = '' } = this.props
    const { postText } = this.state

    if (this.disabled()) return

    this.setState({ inProgressPosts: true })

    createPost({ fileIds: [], text: postText, replyPostId })
      .then(() => {
        if (this.isUnmounted) return
        this.setState({ postText: '', inProgressPosts: false })
      })
      .catch(err => {
        console.error(err)
        if (this.isUnmounted) return
        this.setState({ inProgressPosts: false })
      })
  }

  render() {
    const { classes } = this.props
    const { postText, inProgress } = this.state

    return (
      <div className={classes.root}>
        <div className={classes.actions}>
          <Button color={'primary'} disabled={true}>
            PUBLIC
          </Button>
          <Button color={'primary'} disabled={true}>
            IMAGE
          </Button>
          <Button
            color={'primary'}
            className={classes.submitButton}
            disabled={this.disabled()}
            variant={this.disabled() ? 'text' : 'contained'}
            onClick={this.onSubmitPost}
          >
            GO
            {inProgress && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Button>
        </div>
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
      </div>
    )
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: { marginTop: spacing.unit * 3 },
    actions: {
      textAlign: 'right',
      paddingRight: spacing.unit,
      paddingBottom: spacing.unit
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
    }
  })

export const TextFieldPost = withStyles(styles)(Component)

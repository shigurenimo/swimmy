import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component } from 'react'
import { createPost } from '../libs/createPost'

class PostTextField extends Component {
  isUnmounted = false

  state = {
    postText: '',
    inProgress: false
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

  disabled = () => {
    const { postText, inProgress } = this.state

    return inProgress || postText.match(/\S/g) === null
  }

  onChangePostText = event => {
    event.persist()
    this.setState({ postText: event.target.value })
  }

  onSubmitPost = () => {
    const { postText } = this.state

    if (this.disabled()) return

    this.setState({ inProgress: true })

    createPost({
      fileIds: [],
      text: postText,
      replyPostId: ''
    })
      .then(() => {
        if (this.isUnmounted) return
        this.setState({ postText: '', inProgress: false })
      })
      .catch(err => {
        console.error(err)
        if (this.isUnmounted) return
        this.setState({ inProgress: false })
      })
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }
}

const styles = createStyles({
  root: {
    marginTop: 24
  },
  actions: {
    textAlign: 'right',
    paddingRight: 8,
    paddingBottom: 8
  },
  textField: {
    paddingLeft: 12,
    paddingRight: 12
  },
  submitButton: {
    marginLeft: 8,
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto'
  }
})

export default withStyles(styles)(PostTextField)

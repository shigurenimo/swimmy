import Button from '@material-ui/core/Button/Button'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogActions from '@material-ui/core/DialogActions/DialogActions'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField/TextField'
import { auth } from 'firebase/app'
import React, { Component } from 'react'

class AppSignInDialog extends Component {
  state = {
    errorCode: '',
    errorMessage: '',
    email: '',
    password: '',
    inProgress: false
  }

  render() {
    const { classes, isOpen, closeDialog } = this.props
    const { errorMessage, email, password, inProgress } = this.state

    return (
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        disableBackdropClick={inProgress}
        disableEscapeKeyDown={inProgress}
      >
        <div className={classes.progress}>
          {inProgress && <LinearProgress />}
        </div>
        <DialogTitle>Hello</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email or Username"
            type="email"
            fullWidth
            value={email}
            onChange={this.onChangeEmail}
            disabled={inProgress}
          />
          <TextField
            value={password}
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            onChange={this.onChangePassword}
            disabled={inProgress}
          />
        </DialogContent>
        {errorMessage && (
          <DialogContent>
            <DialogContentText className={classes.errorMassage}>
              ! {errorMessage}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={this.onSignUp} disabled={inProgress}>
            SIGN UP
          </Button>
          <Button
            onClick={this.onSignIn}
            disabled={inProgress}
            variant="contained"
            color="primary"
          >
            SIGN IN
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  onChangeEmail = event => {
    this.setState({
      email: event.target.value,
      errorCode: '',
      errorMessage: ''
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
      errorCode: '',
      errorMessage: ''
    })
  }

  onSignUp = () => {
    const { closeDialog } = this.props
    const { email, password, inProgress } = this.state

    if (inProgress) {
      return
    }

    this.setState({ inProgress: true, errorCode: '', errorMessage: '' })

    const username = email.includes('@') ? email : `${email}@swimmy.io`

    auth()
      .createUserWithEmailAndPassword(username, password)
      .then(() => {
        this.setState({ inProgress: false, email: '', password: '' })
        closeDialog()
      })
      .catch(err => {
        const errorCode = err.code
        const errorMessage = err.message
        this.setState({ errorCode, errorMessage, inProgress: false })
      })
  }

  onSignIn = () => {
    const { closeDialog } = this.props
    const { email, password } = this.state

    this.setState({ inProgress: true, errorCode: '', errorMessage: '' })

    const username = email.includes('@') ? email : `${email}@swimmy.io`

    auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        this.setState({ inProgress: false, email: '', password: '' })
        closeDialog()
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        this.setState({ inProgress: false, errorCode, errorMessage })
      })
  }
}

const styles = theme =>
  createStyles({
    progress: {
      height: 5
    },
    errorMassage: {
      color: theme.palette.light
    }
  })

export default withStyles(styles)(AppSignInDialog)

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import { createStyles, makeStyles } from '@material-ui/styles'
import { auth } from 'firebase/app'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'

interface Props {
  closeDialog: any
  isOpen: boolean
}

interface State {
  errorCode: string
  errorMessage: string
  email: string
  password: string
  inProgress: boolean
}

const DialogAppSignIn: FunctionComponent<Props> = ({ isOpen, closeDialog }) => {
  const classes = useStyle({})
  const [state, setState] = useState<State>({
    email: '',
    errorCode: '',
    errorMessage: '',
    inProgress: false,
    password: ''
  })
  const onChangeEmail = (event: ChangeEvent<any>) => {
    setState({
      ...state,
      email: event.target.value,
      errorCode: '',
      errorMessage: ''
    })
  }
  const onChangePassword = (event: ChangeEvent<any>) => {
    setState({
      ...state,
      password: event.target.value,
      errorCode: '',
      errorMessage: ''
    })
  }
  const onSignUp = () => {
    if (state.inProgress) {
      return
    }
    setState({ ...state, inProgress: true, errorCode: '', errorMessage: '' })
    const username = state.email.includes('@')
      ? state.email
      : `${state.email}@swimmy.io`
    auth()
      .createUserWithEmailAndPassword(username, state.password)
      .then(() => {
        setState({ ...state, inProgress: false, email: '', password: '' })
        closeDialog()
      })
      .catch(err => {
        const errorCode = err.code
        const errorMessage = err.message
        setState({ ...state, errorCode, errorMessage, inProgress: false })
      })
  }
  const onSignIn = () => {
    setState({ ...state, inProgress: true, errorCode: '', errorMessage: '' })
    const username = state.email.includes('@')
      ? state.email
      : `${state.email}@swimmy.io`
    auth()
      .signInWithEmailAndPassword(username, state.password)
      .then(() => {
        setState({ ...state, inProgress: false, email: '', password: '' })
        closeDialog()
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        setState({ ...state, inProgress: false, errorCode, errorMessage })
      })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      disableBackdropClick={state.inProgress}
      disableEscapeKeyDown={state.inProgress}
    >
      <div className={classes.progress}>
        {state.inProgress && <LinearProgress />}
      </div>
      <DialogTitle>Hello</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Email or Username"
          type="email"
          fullWidth
          value={state.email}
          onChange={onChangeEmail}
          disabled={state.inProgress}
        />
        <TextField
          value={state.password}
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          onChange={onChangePassword}
          disabled={state.inProgress}
        />
      </DialogContent>
      {state.errorMessage && (
        <DialogContent>
          <DialogContentText className={classes.errorMassage}>
            ! {state.errorMessage}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          onClick={onSignUp}
          disabled={state.inProgress}
          aria-label={'Sign up with email or username'}
        >
          SIGN UP
        </Button>
        <Button
          onClick={onSignIn}
          disabled={state.inProgress}
          variant="contained"
          color="primary"
          aria-label={'Sign in with email or username'}
        >
          SIGN IN
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyle = makeStyles(({ palette }) => {
  return createStyles({
    progress: { height: 5 },
    errorMassage: { color: palette.error.light }
  })
})

export default DialogAppSignIn

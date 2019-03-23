import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  TextField
} from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/styles'
import { auth } from 'firebase/app'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'

type Props = {
  closeDialog: () => void
  isOpen: boolean
}

const DialogSignIn: FunctionComponent<Props> = ({ isOpen, closeDialog }) => {
  const classes = useStyle({})
  const [email, setEmail] = useState('')
  const [errorCode, setErrorCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const [password, setPassword] = useState('')
  const onChangeEmail = (event: ChangeEvent<any>) => {
    setEmail(event.target.value)
    setErrorCode('')
    setErrorMessage('')
  }
  const onChangePassword = (event: ChangeEvent<any>) => {
    setErrorCode('')
    setErrorMessage('')
    setPassword(event.target.value)
  }
  const onSignUp = () => {
    if (inProgress) {
      return
    }
    setInProgress(true)
    setErrorCode('')
    setErrorMessage('')
    const username = email.includes('@') ? email : `${email}@swimmy.io`
    auth()
      .createUserWithEmailAndPassword(username, password)
      .then(() => {
        setInProgress(false)
        setEmail('')
        setPassword('')
        closeDialog()
      })
      .catch(err => {
        setErrorCode(err.code)
        setErrorMessage(err.message)
        setInProgress(false)
      })
  }
  const onSignIn = () => {
    setInProgress(true)
    setErrorCode('')
    setErrorMessage('')
    const username = email.includes('@') ? email : `${email}@swimmy.io`
    auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        setInProgress(false)
        setEmail('')
        setPassword('')
        closeDialog()
      })
      .catch(error => {
        setInProgress(false)
        setErrorCode(error.code)
        setErrorMessage(error.message)
      })
  }

  return (
    <Dialog
      disableBackdropClick={inProgress}
      disableEscapeKeyDown={inProgress}
      onClose={closeDialog}
      open={isOpen}
    >
      <div className={classes.progress}>{inProgress && <LinearProgress />}</div>
      <DialogTitle>Hello</DialogTitle>
      <DialogContent>
        <TextField
          disabled={inProgress}
          fullWidth={true}
          label={'Email or Username'}
          margin={'dense'}
          onChange={onChangeEmail}
          type={'email'}
          value={email}
        />
        <TextField
          disabled={inProgress}
          fullWidth={true}
          label={'Password'}
          margin={'dense'}
          onChange={onChangePassword}
          type={'password'}
          value={password}
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
        <Button
          aria-label={'Sign up with email or username'}
          disabled={inProgress}
          onClick={onSignUp}
        >
          SIGN UP
        </Button>
        <Button
          aria-label={'Sign in with email or username'}
          color={'primary'}
          disabled={inProgress}
          onClick={onSignIn}
          variant={'contained'}
        >
          SIGN IN
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyle = makeStyles(({ palette }) => {
  return createStyles({
    errorMassage: { color: palette.error.light },
    progress: { height: 5 }
  })
})

export default DialogSignIn

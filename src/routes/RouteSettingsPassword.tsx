import {
  Button,
  Snackbar,
  SnackbarContent,
  TextField,
  Typography,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classnames from 'classnames'
import { auth } from 'firebase/app'
import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState
} from 'react'
import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import Head from '../components/Head'
import Header from '../components/Header'
import { useSubscription } from '../hooks/useSubscription'
import { pct } from '../libs/pct'
import { px } from '../libs/px'

const RouteSettingsPassword: FunctionComponent = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const [password, setPassword] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarType, setSnackbarType] = useState('')
  const classes = useStyles({})
  const [subscription, setSubscription] = useSubscription()
  const disabled =
    !password || !currentPassword || password === currentPassword || inProgress
  const onChangePassword = (event: ChangeEvent<any>) => {
    setPassword(event.target.value)
  }
  const onChangePasswordRetype = (event: ChangeEvent<any>) => {
    setCurrentPassword(event.target.value)
  }
  const onSubmit = () => {
    if (password === currentPassword) {
      return
    }
    setInProgress(true)
    const currentUser = auth().currentUser
    if (!currentUser) {
      throw new Error('currentUser not found')
    }
    const { email } = currentUser
    if (!email) {
      throw new Error('email not found')
    }
    const credential = auth.EmailAuthProvider.credential(email, currentPassword)
    const _subscription = from(
      currentUser.reauthenticateWithCredential(credential)
    )
      .pipe(
        mergeMap(() => {
          return currentUser.updatePassword(password)
        })
      )
      .subscribe(
        () => {
          setCurrentPassword('')
          setInProgress(false)
          setPassword('')
          setSnackbarMessage('パスワードを更新しました')
          setSnackbarOpen(true)
          setSnackbarType('success')
        },
        err => {
          setInProgress(false)
          setSnackbarMessage(`ERROR: ${err.message}`)
          setSnackbarOpen(true)
          setSnackbarType('error')
        }
      )
    setSubscription(_subscription)
  }
  const onCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  useEffect(() => {
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Fragment>
      <Head title={'パスワードの変更'} />
      <Header />
      <main className={classes.root}>
        <Typography variant={'h4'}>パスワードの変更</Typography>
        <form className={classes.form}>
          <div>
            <TextField
              value={currentPassword}
              type={'password'}
              label={'現在のパスワード'}
              fullWidth
              variant={'outlined'}
              onChange={onChangePasswordRetype}
              disabled={inProgress}
            />
          </div>
          <div>
            <TextField
              value={password}
              type={'password'}
              label={'新しいパスワード'}
              fullWidth
              variant={'outlined'}
              onChange={onChangePassword}
              disabled={inProgress}
            />
          </div>
          <div className={classes.actions}>
            <Button
              variant={'contained'}
              color={'primary'}
              disabled={disabled}
              onClick={onSubmit}
              aria-label={'Update your password'}
            >
              変更する
            </Button>
          </div>
        </form>
      </main>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbarOpen}
        onClose={onCloseSnackbar}
      >
        <SnackbarContent
          message={snackbarMessage}
          className={classnames({
            [classes.snackbarError]: snackbarType === 'error'
          })}
        />
      </Snackbar>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing, palette }) => {
  return {
    actions: { textAlign: 'right' },
    form: {
      display: 'grid',
      gridRowGap: px(spacing(2)),
      margin: '0 auto',
      maxWidth: spacing(100),
      width: pct(100)
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing(4)),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      paddingTop: spacing(4)
    },
    snackbarError: { backgroundColor: palette.error.dark },
    snackbarMessage: { color: 'tomato' }
  }
})

export default RouteSettingsPassword

import {
  Button,
  Snackbar,
  SnackbarContent,
  TextField,
  Theme,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classnames from 'classnames'
import { auth } from 'firebase/app'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { useAuthUser } from '../shared/auth/useAuthUser'
import Header from '../shared/components/AppBarDefault'
import FragmentHead from '../shared/components/FragmentHead'
import { pct } from '../shared/styles/pct'
import { px } from '../shared/styles/px'

const RouteSettingsPassword: FunctionComponent = () => {
  const [authUser] = useAuthUser()

  const [currentPassword, setCurrentPassword] = useState('')

  const [inProgress, setInProgress] = useState(false)

  const [password, setPassword] = useState('')

  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const [snackbarType, setSnackbarType] = useState('')

  const classes = useStyles({})

  const disabled =
    !password || !currentPassword || password === currentPassword || inProgress

  useEffect(() => {
    if (!inProgress) return
    if (!authUser) return
    if (!authUser.email) return
    const credential = auth.EmailAuthProvider.credential(
      authUser.email,
      currentPassword
    )
    const subscription = from(authUser.reauthenticateWithCredential(credential))
      .pipe(mergeMap(() => authUser.updatePassword(password)))
      .subscribe(
        () => {
          // do not change the order
          setInProgress(false)
          setCurrentPassword('')
          setPassword('')
          setSnackbarMessage('パスワードを更新しました')
          setSnackbarOpen(true)
          setSnackbarType('success')
        },
        err => {
          // do not change the order
          setInProgress(false)
          setSnackbarMessage(`ERROR: ${err.message}`)
          setSnackbarOpen(true)
          setSnackbarType('error')
        }
      )
    return () => subscription.unsubscribe()
  }, [authUser, currentPassword, inProgress, password])

  return (
    <Fragment>
      <FragmentHead title={'パスワードの変更'} />
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
              onChange={event => {
                setCurrentPassword(event.target.value)
              }}
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
              onChange={event => {
                setPassword(event.target.value)
              }}
              disabled={inProgress}
            />
          </div>
          <div className={classes.actions}>
            <Button
              variant={'contained'}
              color={'primary'}
              disabled={disabled}
              onClick={() => setInProgress(true)}
              aria-label={'Update your password'}
            >
              {'変更する'}
            </Button>
          </div>
        </form>
      </main>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
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

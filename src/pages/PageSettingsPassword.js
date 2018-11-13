import Button from '@material-ui/core/Button/Button'
import Snackbar from '@material-ui/core/Snackbar/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField/TextField'
import Typography from '@material-ui/core/Typography/Typography'
import classnames from 'classnames'
import { auth } from 'firebase/app'
import React, { Fragment } from 'react'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  state = {
    password: '',
    currentPassword: '',
    snackbarOpen: false,
    snackbarMessage: '',
    snackbarType: ''
  }
  isUnmounted = false

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  onChangePasswordRetype = event => {
    this.setState({ currentPassword: event.target.value })
  }

  onSubmit = () => {
    const { password, currentPassword } = this.state

    if (password === currentPassword) return

    this.setState({ inProgress: true })

    const { email } = auth().currentUser

    const credential = auth.EmailAuthProvider.credential(email, currentPassword)

    auth()
      .currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        return auth().currentUser.updatePassword(password)
      })
      .then(() => {
        if (this.isUnmounted) return
        this.setState({
          inProgress: false,
          snackbarOpen: true,
          snackbarMessage: 'パスワードを更新しました',
          snackbarType: 'success',
          password: '',
          currentPassword: ''
        })
      })
      .catch(err => {
        if (this.isUnmounted) return
        this.setState({
          inProgress: false,
          snackbarOpen: true,
          snackbarMessage: `ERROR: ${err.message}`,
          snackbarType: 'error'
        })
      })
  }

  onCloseSnackbar = () => {
    this.setState({ snackbarOpen: false })
  }

  render() {
    const { classes } = this.props
    const {
      password,
      currentPassword,
      inProgress,
      snackbarOpen,
      snackbarMessage,
      snackbarType
    } = this.state

    return (
      <Fragment>
        <div className={classes.root}>
          <Typography variant={'h5'}>パスワードの変更</Typography>
          <form className={classes.form}>
            <div>
              <TextField
                value={currentPassword}
                type={'password'}
                label={'現在のパスワード'}
                fullWidth
                variant={'outlined'}
                onChange={this.onChangePasswordRetype}
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
                onChange={this.onChangePassword}
                disabled={inProgress}
              />
            </div>
            <div className={classes.actions}>
              <Button
                variant={'contained'}
                color={'primary'}
                disabled={this.disabled}
                onClick={this.onSubmit}
              >
                変更する
              </Button>
            </div>
          </form>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackbarOpen}
          onClose={this.onCloseSnackbar}
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

  get disabled() {
    const { password, currentPassword, inProgress } = this.state

    return (
      !password ||
      !currentPassword ||
      password === currentPassword ||
      inProgress
    )
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }
}

const styles = ({ spacing, palette }) =>
  createStyles({
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 4),
      paddingTop: spacing.unit * 4,
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2
    },
    form: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      maxWidth: spacing.unit * 100,
      width: pct(100),
      margin: '0 auto'
    },
    actions: { textAlign: 'right' },
    snackbarMessage: { color: 'tomato' },
    snackbarError: { backgroundColor: palette.error.dark }
  })

export const PageSettingsPassword = withStyles(styles)(Component)

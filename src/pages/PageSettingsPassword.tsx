import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { createStyles, withStyles, WithStyles } from '@material-ui/styles'
import classnames from 'classnames'
import { auth } from 'firebase/app'
import React, { ChangeEvent, Component, Fragment } from 'react'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'

const styles = ({ spacing, palette }: Theme) => {
  return createStyles({
    actions: { textAlign: 'right' },
    form: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      maxWidth: spacing.unit * 100,
      width: pct(100),
      margin: '0 auto'
    },
    root: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 4),
      paddingLeft: spacing.unit * 2,
      paddingRight: spacing.unit * 2,
      paddingTop: spacing.unit * 4
    },
    snackbarError: { backgroundColor: palette.error.dark },
    snackbarMessage: { color: 'tomato' }
  })
}

interface Props extends WithStyles<typeof styles> {}

interface State {
  password: string
  currentPassword: string
  snackbarOpen: boolean
  snackbarMessage: string
  snackbarType: string
  inProgress: boolean
}

class PageSettingsPassword extends Component<Props> {
  public state: State = {
    currentPassword: '',
    inProgress: false,
    password: '',
    snackbarMessage: '',
    snackbarOpen: false,
    snackbarType: ''
  }

  private isUnmounted = false

  get disabled() {
    const { password, currentPassword, inProgress } = this.state
    return (
      !password ||
      !currentPassword ||
      password === currentPassword ||
      inProgress
    )
  }

  public render() {
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
          <Typography variant={'h4'}>パスワードの変更</Typography>
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
                aria-label={'Update your password'}
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

  public componentWillUnmount() {
    this.isUnmounted = true
  }

  private onChangePassword = (event: ChangeEvent<any>) => {
    this.setState({ password: event.target.value })
  }

  private onChangePasswordRetype = (event: ChangeEvent<any>) => {
    this.setState({ currentPassword: event.target.value })
  }

  private onSubmit = () => {
    const { password, currentPassword } = this.state
    if (password === currentPassword) {
      return
    }
    this.setState({ inProgressSubmit: true })
    const currentUser = auth().currentUser
    if (!currentUser) {
      throw new Error('currentUser not found')
    }
    const { email } = currentUser
    if (!email) {
      throw new Error('email not found')
    }
    const credential = auth.EmailAuthProvider.credential(email, currentPassword)
    currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        return currentUser.updatePassword(password)
      })
      .then(() => {
        if (this.isUnmounted) {
          return
        }
        this.setState({
          currentPassword: '',
          inProgressSubmit: false,
          password: '',
          snackbarMessage: 'パスワードを更新しました',
          snackbarOpen: true,
          snackbarType: 'success'
        })
      })
      .catch(err => {
        if (this.isUnmounted) {
          return
        }
        this.setState({
          inProgressSubmit: false,
          snackbarMessage: `ERROR: ${err.message}`,
          snackbarOpen: true,
          snackbarType: 'error'
        })
      })
  }

  private onCloseSnackbar = () => {
    this.setState({ snackbarOpen: false })
  }
}

export default withStyles(styles)(PageSettingsPassword)

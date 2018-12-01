import { Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button/Button'
import Snackbar from '@material-ui/core/Snackbar/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { WithStyles } from '@material-ui/styles/withStyles'
import classnames from 'classnames'
import { auth } from 'firebase/app'
import React, { ChangeEvent, Component, Fragment } from 'react'
import { pct } from '../libs/styles/pct'
import { px } from '../libs/styles/px'

const styles = ({ spacing, palette }: Theme) => {
  return createStyles({
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
    password: '',
    currentPassword: '',
    snackbarOpen: false,
    snackbarMessage: '',
    snackbarType: '',
    inProgress: false
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

  componentWillUnmount() {
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

    if (password === currentPassword) return

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
        if (this.isUnmounted) return
        this.setState({
          inProgressSubmit: false,
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
          inProgressSubmit: false,
          snackbarOpen: true,
          snackbarMessage: `ERROR: ${err.message}`,
          snackbarType: 'error'
        })
      })
  }

  private onCloseSnackbar = () => {
    this.setState({ snackbarOpen: false })
  }
}

export default withStyles(styles)(PageSettingsPassword)

import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField/TextField'
import React from 'react'

class Component extends React.Component<any, any> {
  state = {}
  onChangeMajorVersion = event => {
    const num = event.target.value
    if (num < 0) {
      return
    }
    const { version, onChangeVersion } = this.props
    const dataVersion = ('00000000' + version).slice(-9)
    const a = [
      num * 1000000,
      dataVersion.slice(-6).slice(0, 3) * 1000,
      dataVersion.slice(-3)
    ]
      .map(a => Number(a))
      .reduce((a, b) => a + b)
    onChangeVersion(a)
  }
  onChangeMinerVersion = event => {
    const num = event.target.value
    if (num < 0) {
      return
    }
    const { version, onChangeVersion } = this.props
    const dataVersion = ('00000000' + version).slice(-9)
    const a = [
      dataVersion.slice(0, 3) * 1000000,
      num * 1000,
      dataVersion.slice(-3)
    ]
      .map(a => Number(a))
      .reduce((a, b) => a + b)
    onChangeVersion(a)
  }
  onChangePatchVersion = event => {
    const num = event.target.value
    if (num < 0) {
      return
    }
    const { version, onChangeVersion } = this.props
    const dataVersion = ('00000000' + version).slice(-9)
    const a = [
      dataVersion.slice(0, 3) * 1000000,
      dataVersion.slice(-6).slice(0, 3) * 1000,
      num
    ]
      .map(a => Number(a))
      .reduce((a, b) => a + b)
    onChangeVersion(a)
  }

  render() {
    const { classes, version } = this.props

    const dataVersion = ('00000000' + version).slice(-9)
    const [major, miner, patch] = [
      x => x.slice(0, 3),
      x => x.slice(-6).slice(0, 3),
      x => x.slice(-3)
    ]
      .map(f => f(dataVersion))
      .map(a => parseInt(a, 10))

    return (
      <div className={classes.root}>
        <TextField
          className={classes.textField}
          onChange={this.onChangeMajorVersion}
          value={major}
          type={'number'}
          variant={'outlined'}
        />
        <span>{','}</span>
        <TextField
          className={classes.textField}
          onChange={this.onChangeMinerVersion}
          value={miner}
          type={'number'}
          variant={'outlined'}
        />
        <span>{','}</span>
        <TextField
          className={classes.textField}
          onChange={this.onChangePatchVersion}
          value={patch}
          type={'number'}
          variant={'outlined'}
        />
      </div>
    )
  }
}

const styles = createStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '80px 16px 80px 16px 80px',
    gridColumnGap: '16px',
    alignItems: 'flex-end',
    textAlign: 'center'
  }
})

export const FormItemVersion = withStyles(styles)(Component)

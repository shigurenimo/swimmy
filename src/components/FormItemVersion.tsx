import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/styles'
import React, { ChangeEvent, FunctionComponent } from 'react'
import { px } from '../libs/styles/px'

interface Props {
  onChangeVersion: any
  version: number
}

const FormItemVersion: FunctionComponent<Props> = ({
  onChangeVersion,
  version
}) => {
  const onChangeMajorVersion = (event: ChangeEvent<any>) => {
    const num = event.target.value
    if (num < 0) {
      return
    }
    const dataVersion: any = ('00000000' + version).slice(-9)
    const a = [
      num * 1000000,
      dataVersion.slice(-6).slice(0, 3) * 1000,
      dataVersion.slice(-3)
    ]
      .map(a => Number(a))
      .reduce((a, b) => a + b)
    onChangeVersion(a)
  }
  const onChangeMinerVersion = (event: ChangeEvent<any>) => {
    const num = event.target.value
    if (num < 0) {
      return
    }
    const dataVersion: any = ('00000000' + version).slice(-9)
    const a = [
      dataVersion.slice(0, 3) * 1000000,
      num * 1000,
      dataVersion.slice(-3)
    ]
      .map(a => Number(a))
      .reduce((a, b) => a + b)
    onChangeVersion(a)
  }
  const onChangePatchVersion = (event: ChangeEvent<any>) => {
    const num = event.target.value
    if (num < 0) {
      return
    }
    const dataVersion: any = ('00000000' + version).slice(-9)
    const a = [
      dataVersion.slice(0, 3) * 1000000,
      dataVersion.slice(-6).slice(0, 3) * 1000,
      num
    ]
      .map(a => Number(a))
      .reduce((a, b) => a + b)
    onChangeVersion(a)
  }
  const classes = useStyles({})
  const dataVersion = ('00000000' + version).slice(-9)
  const [major, miner, patch] = [
    (x: any) => x.slice(0, 3),
    (x: any) => x.slice(-6).slice(0, 3),
    (x: any) => x.slice(-3)
  ]
    .map(f => f(dataVersion))
    .map(a => parseInt(a, 10))

  return (
    <div className={classes.root}>
      <TextField
        onChange={onChangeMajorVersion}
        value={major}
        type={'number'}
        variant={'outlined'}
      />
      <span>{','}</span>
      <TextField
        onChange={onChangeMinerVersion}
        value={miner}
        type={'number'}
        variant={'outlined'}
      />
      <span>{','}</span>
      <TextField
        onChange={onChangePatchVersion}
        value={patch}
        type={'number'}
        variant={'outlined'}
      />
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      display: 'grid',
      gridTemplateColumns: '80px 16px 80px 16px 80px',
      gridColumnGap: px(spacing.unit * 2),
      alignItems: 'flex-end',
      textAlign: 'center'
    }
  }
})

export default FormItemVersion

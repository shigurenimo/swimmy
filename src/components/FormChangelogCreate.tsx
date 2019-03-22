import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/styles'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { createChangelog } from '../helpers/createChangelog'
import { px } from '../libs/styles/px'
import FormItemContents from './FormItemContents'
import FormItemVersion from './FormItemVersion'

const FormChangelogCreate: FunctionComponent = () => {
  const [contents, setContents] = useState<string[]>([])
  const [date, setDate] = useState<string>('2017-05-24')
  const [version, setVersion] = useState<number>(1000000)
  const classes = useStyles({})
  const onChangeContents = (_contents: string[]) => {
    setContents(_contents)
  }
  const onChangeDate = (event: ChangeEvent<any>) => {
    setDate(event.target.value)
  }
  const onChangeVersion = (_version: number) => {
    setVersion(_version)
  }
  const onSubmit = () => {
    createChangelog({
      contents: contents.filter(content => content),
      date: new Date(date).getTime(),
      version
    }).then(() => {
      setContents([''])
    })
  }

  return (
    <form className={classes.root}>
      <FormItemVersion onChangeVersion={onChangeVersion} version={version} />
      <FormItemContents
        onChangeContents={onChangeContents}
        contents={contents}
      />
      <div>
        <TextField
          onChange={onChangeDate}
          type={'date'}
          value={date}
          variant={'outlined'}
        />
      </div>
      <div>
        <Button
          aria-label={'Send this changelog'}
          color={'primary'}
          onClick={onSubmit}
          variant={'outlined'}
        >
          submit
        </Button>
      </div>
    </form>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: { display: 'grid', gridRowGap: px(spacing.unit * 2) }
  }
})

export default FormChangelogCreate

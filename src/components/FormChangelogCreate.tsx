import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/styles'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { createChangelog } from '../libs/createChangelog'
import { px } from '../libs/styles/px'
import FormItemContents from './FormItemContents'
import FormItemVersion from './FormItemVersion'

interface State {
  contents: string[]
  date: string
  version: number
}

const FormChangelogCreate: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    contents: [''],
    date: '2017-05-24',
    version: 1000000
  })
  const classes = useStyles({})
  const onChangeContents = (contents: string[]) => {
    setState({ ...state, contents })
  }
  const onChangeDate = (event: ChangeEvent<any>) => {
    setState({ ...state, date: event.target.value })
  }
  const onChangeVersion = (version: number) => {
    setState({ ...state, version })
  }
  const onSubmit = () => {
    createChangelog({
      contents: state.contents.filter(content => content),
      date: new Date(state.date).getTime(),
      version: state.version
    }).then(() => {
      setState({ ...state, contents: [''] })
    })
  }

  return (
    <form className={classes.root}>
      <FormItemVersion
        onChangeVersion={onChangeVersion}
        version={state.version}
      />
      <FormItemContents
        onChangeContents={onChangeContents}
        contents={state.contents}
      />
      <div>
        <TextField
          onChange={onChangeDate}
          value={state.date}
          type="date"
          variant="outlined"
        />
      </div>
      <div>
        <Button
          onClick={onSubmit}
          variant="outlined"
          color="primary"
          aria-label={'Send this changelog'}
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

import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { px } from '../libs/styles/px'

type Props = {
  contents: any[]
  onChangeContents: any
}

const FormItemContents: FunctionComponent<Props> = ({
  contents,
  onChangeContents
}) => {
  const classes = useStyles({})
  const onChange = (index: number) => (event: any) => {
    contents[index] = event.target.value
    const blankContents = contents.filter(content => content === '')
    if (blankContents.length === 0) {
      contents.push('')
    }
    if (blankContents.length > 1) {
      const contentIndex = contents.findIndex(content => content === '')
      contents.splice(contentIndex, 1)
    }
    onChangeContents(contents)
  }

  return (
    <div className={classes.root}>
      {contents.map((content, i) => (
        <TextField
          key={i}
          onChange={onChange(i)}
          value={content}
          variant={'outlined'}
        />
      ))}
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      alignItems: 'flex-end',
      display: 'grid',
      gridRowGap: px(spacing(2)),
      gridTemplateColumns: '1fr',
      textAlign: 'center'
    }
  }
})

export default FormItemContents

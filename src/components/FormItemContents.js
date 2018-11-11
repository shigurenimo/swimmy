import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField/TextField'
import React from 'react'

class Component extends React.Component<any, any> {
  state = {}
  onChange = index => event => {
    const { contents, onChangeContents } = this.props
    contents[index] = event.target.value
    const blankContents = contents.filter(content => content === '')
    if (blankContents.length === 0) {
      contents.push('')
    }
    if (blankContents.length > 1) {
      const index = contents.findIndex(content => content === '')
      contents.splice(index, 1)
    }
    onChangeContents(contents)
  }

  render() {
    const { classes, contents } = this.props

    return (
      <div className={classes.root}>
        {contents.map((content, i) => (
          <TextField
            className={classes.textField}
            key={i}
            onChange={this.onChange(i)}
            value={content}
            variant="outlined"
          />
        ))}
      </div>
    )
  }
}

const styles = createStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '16px',
    alignItems: 'flex-end',
    textAlign: 'center'
  }
})

export const FormItemContents = withStyles(styles)(Component)

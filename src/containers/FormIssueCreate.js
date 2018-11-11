import Button from '@material-ui/core/Button/Button'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField/TextField'
import React from 'react'
import { FormItemContents } from '../components/FormItemContents'
import { FormItemVersion } from '../components/FormItemVersion'
import { createChangelog } from '../libs/createChangelog'

class Component extends React.Component<any, any> {
  state = { contents: [''], date: '2017-05-24', version: 1000000 }
  onChangeContents = (contents: string[]) => {
    this.setState({ contents })
  }
  onChangeDate = event => {
    this.setState({ date: event.target.value })
  }
  onChangeVersion = (version: number) => {
    this.setState({ version })
  }
  onSubmit = () => {
    const { contents, date, version } = this.state
    createChangelog({
      contents: contents.filter(content => content),
      date: new Date(date).getTime(),
      version
    }).then(() => {
      this.setState({ contents: [''] })
    })
  }

  render() {
    const { classes } = this.props
    const { contents, date, version } = this.state

    return (
      <form className={classes.root}>
        <FormItemVersion
          onChangeVersion={this.onChangeVersion}
          version={version}
        />
        <FormItemContents
          onChangeContents={this.onChangeContents}
          contents={contents}
        />
        <div>
          <TextField
            className={classes.textField}
            onChange={this.onChangeDate}
            value={date}
            type="date"
            variant="outlined"
          />
        </div>
        <div>
          <Button onClick={this.onSubmit} variant="outlined" color="primary">
            submit
          </Button>
        </div>
      </form>
    )
  }
}

const styles = createStyles({
  root: { display: 'grid', gridRowGap: '16px' }
})

export const FormIssueCreate = withStyles(styles)(Component)

import { Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button/Button'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import { WithStyles } from '@material-ui/styles/withStyles'
import React, { ChangeEvent, Component } from 'react'
import FormItemContents from '../components/FormItemContents'
import FormItemVersion from '../components/FormItemVersion'
import { createChangelog } from '../libs/createChangelog'
import { px } from '../libs/styles/px'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: { display: 'grid', gridRowGap: px(spacing.unit * 2) }
  })
}

interface Props extends WithStyles<typeof styles> {}

interface State {
  contents: string[]
  date: string
  version: number
}

class FormChangelogCreate extends Component<Props, State> {
  state = { contents: [''], date: '2017-05-24', version: 1000000 }
  onChangeContents = (contents: string[]) => {
    this.setState({ contents })
  }
  onChangeDate = (event: ChangeEvent<any>) => {
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
            onChange={this.onChangeDate}
            value={date}
            type="date"
            variant="outlined"
          />
        </div>
        <div>
          <Button
            onClick={this.onSubmit}
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
}

export default withStyles(styles)(FormChangelogCreate)

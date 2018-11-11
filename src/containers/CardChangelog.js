import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography/Typography'
import React from 'react'

class Component extends React.Component<any, any> {
  state = {}

  render() {
    const { classes, version, contents, date } = this.props

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {version}
          </Typography>
          <Typography className={classes.date}>{date}</Typography>
          {contents.map((content, i) => (
            <Typography gutterBottom className={classes.description} key={i}>
              - {content}
            </Typography>
          ))}
        </CardContent>
      </Card>
    )
  }
}

const styles = ({ spacing }) =>
  createStyles({
    version: { flexBasis: '33.33%', flexShrink: 0 },
    date: { opacity: 0.65, fontSize: 12, marginBottom: spacing.unit },
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' }
  })

export const CardChangelog = withStyles(styles)(Component)

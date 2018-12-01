import Card from '@material-ui/core/Card/Card'
import CardContent from '@material-ui/core/CardContent/CardContent'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/styles/makeStyles'
import React, { FunctionComponent } from 'react'

interface Props {
  version: string
  contents: any[]
  date: string
}

const CardChangelog: FunctionComponent<Props> = props => {
  const { version, contents, date } = props
  const classes = useStyles({})

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

const useStyles = makeStyles(({ spacing }) => {
  return {
    version: { flexBasis: '33.33%', flexShrink: 0 },
    date: { opacity: 0.65, fontSize: 12, marginBottom: spacing.unit },
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' }
  }
})

export default CardChangelog

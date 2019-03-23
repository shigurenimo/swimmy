import { Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'

type Props = {
  version: string
  contents: any[]
  date: string
}

const CardChangelog: FunctionComponent<Props> = ({
  version,
  contents,
  date
}) => {
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
    date: { opacity: 0.65, fontSize: 12, marginBottom: spacing(1) },
    description: { whiteSpace: 'pre-line', wordBreak: 'break-all' },
    version: { flexBasis: '33.33%', flexShrink: 0 }
  }
})

export default CardChangelog

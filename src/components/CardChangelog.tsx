import { Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Changelog } from '../interfaces/models/changelog'
import { toDateStringFromPrismicDate } from '../libs/toDateStringFromPrismicDate'
import { toVersionStr } from '../libs/toVersionStr'

type Props = { changelog: Changelog }

const CardChangelog: FunctionComponent<Props> = ({ changelog }) => {
  const classes = useStyles({})

  return (
    <Card>
      <CardContent>
        <Typography variant={'h5'} component={'h2'}>
          {toVersionStr(changelog.version)}
        </Typography>
        <Typography className={classes.date}>
          {toDateStringFromPrismicDate(changelog.date)}
        </Typography>
        <ul className={classes.list}>
          {changelog.contents.map((content, i) => (
            <li key={i}>
              <Typography className={classes.text}>{content.text}</Typography>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return {
    date: { opacity: 0.65, fontSize: 12, marginBottom: spacing(1) },
    list: { display: 'grid', gridRowGap: spacing(1) },
    text: { whiteSpace: 'pre-line', wordBreak: 'break-all' },
    version: { flexBasis: '33.33%', flexShrink: 0 }
  }
})

export default CardChangelog

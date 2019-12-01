import { Card, CardContent, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import { Changelog } from '../../firestore/types/changelog'
import { resetList } from '../../styles/resetList'
import { toDateTextFromPrismicDate } from '../helpers/toDateTextFromPrismicDate'
import { toVersionText } from '../helpers/toVersionText'

type Props = { changelog: Changelog }

const CardChangelog: FunctionComponent<Props> = ({ changelog }) => {
  const classes = useStyles()

  return (
    <Card>
      <CardContent
        className={classes.cardContent}
        style={{ paddingBottom: 16 }}
      >
        <div className={classes.title}>
          <Typography
            component={'h2'}
            style={{ fontWeight: 'bold' }}
            variant={'h5'}
          >
            {toVersionText(changelog.version)}
          </Typography>
          <Typography className={classes.date}>
            {toDateTextFromPrismicDate(changelog.date)}
          </Typography>
        </div>
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

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    cardContent: { display: 'grid', gridRowGap: spacing(1) },
    title: { display: 'grid', gridTemplateColumns: '1fr auto' },
    date: { opacity: 0.65, fontSize: 12, marginBottom: spacing(1) },
    list: { ...resetList(), display: 'grid', gridRowGap: spacing(1) },
    text: { whiteSpace: 'pre-line', wordBreak: 'break-all' },
    version: { flexBasis: '33.33%', flexShrink: 0 },
  }
})

export default CardChangelog

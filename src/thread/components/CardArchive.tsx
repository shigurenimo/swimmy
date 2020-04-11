import { Card, CardHeader, Divider, IconButton, Theme } from '@material-ui/core'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import { makeStyles } from '@material-ui/styles'
import { analytics } from 'firebase/app'
import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import { Archive } from '../types/archive'
import ListItemThread from './ListItemThread'

type Props = { archive: Archive }

const CardArchive: FunctionComponent<Props> = ({ archive }) => {
  const classes = useStyles()

  const history = useHistory()

  const onClick = () => {
    const path = `/archives/${archive.year}/${archive.month + 1}`
    analytics().logEvent('select_content', {
      content_id: `archive-${archive.year}-${archive.month + 1}`,
      content_type: 'thread',
      to: path,
    })
    history.push(path)
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton size={'small'} onClick={onClick}>
            <KeyboardArrowRightIcon />
          </IconButton>
        }
        titleTypographyProps={{ style: { fontWeight: 'bold' }, variant: 'h6' }}
        title={`${archive.year}年 ${archive.month + 1}月`}
      />
      <ul>
        <Divider />
        {archive.posts
          .filter((_, i) => i < 4)
          .map(thread => (
            <ListItemThread key={thread.id} post={thread} />
          ))}
      </ul>
    </Card>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return { root: { display: 'grid' } }
})

export default CardArchive

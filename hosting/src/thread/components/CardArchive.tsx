import { Card, CardHeader, Divider, IconButton, Theme } from '@material-ui/core'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import { makeStyles } from '@material-ui/styles'
import firebase from 'firebase/app'
import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import { ListItemThread } from 'src/thread/components/ListItemThread'
import { Archive } from 'src/thread/types/archive'

type Props = { archive: Archive }

export const CardArchive: FunctionComponent<Props> = ({ archive }) => {
  const classes = useStyles()

  const history = useHistory()

  const onClick = () => {
    const path = `/archives/${archive.year}/${archive.month + 1}`
    firebase.analytics().logEvent('select_content', {
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
          .map((thread) => (
            <ListItemThread key={thread.id} post={thread} />
          ))}
      </ul>
    </Card>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return { root: { display: 'grid' } }
})

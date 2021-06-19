import { ListItem, ListItemText, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import firebase from 'firebase/app'
import React, { Fragment, FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import { Post } from 'src/core/types/post'
import { toDateText } from 'src/core/utils/toDateText'

type Props = {
  post: Post
  selected: boolean
}

export const ListItemThread: FunctionComponent<Props> = ({
  post,
  selected = false,
}) => {
  const classes = useStyles()

  const history = useHistory()

  const onClick = () => {
    firebase.analytics().logEvent('select_content', {
      content_id: post.id,
      content_type: 'thread',
    })
    history.push(`/threads/${post.id}`)
  }

  return (
    <ListItem disabled={selected} button divider onClick={onClick}>
      <ListItemText
        className={classes.listItemText}
        primary={post.text}
        secondaryTypographyProps={{ className: classes.secondary }}
        secondary={
          <Fragment>
            <Typography className={classes.comment} variant={'caption'}>
              {`${post.replyPostCount}コメント`}
            </Typography>
            <Typography variant={'caption'}>
              {toDateText(post.updatedAt)}
            </Typography>
          </Fragment>
        }
      />
    </ListItem>
  )
}

const useStyles = makeStyles<Theme>(({ spacing, palette }) => {
  return {
    comment: { color: palette.primary.dark, fontWeight: 'bold' },
    listItemText: { display: 'grid', gridGap: spacing(0.5) },
    secondary: {
      display: 'grid',
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
      justifyContent: 'space-between',
    },
  }
})

import { ListItem, ListItemText, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Post } from 'app/shared/firestore/types/post'
import { toDateText } from 'app/shared/helpers/toDateText'
import React, { Fragment, FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  post: Post
  selected: boolean
}

const ListItemThread: FunctionComponent<Props> = ({ post, selected }) => {
  const classes = useStyles()

  return (
    <Link to={`/threads/${post.id}`}>
      <ListItem button divider selected={selected}>
        <ListItemText
          className={classes.listItemText}
          primary={post.text}
          secondaryTypographyProps={{
            className: classes.secondary,
            component: 'div'
          }}
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
    </Link>
  )
}

const useStyles = makeStyles<Theme>(({ spacing, palette }) => {
  return {
    comment: { color: palette.primary.dark, fontWeight: 'bold' },
    secondary: {
      display: 'grid',
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
      justifyContent: 'space-between'
    },
    listItemText: { display: 'grid', gridGap: spacing(0.5) }
  }
})

export default ListItemThread

import { ListItem, ListItemText, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Post } from 'app/shared/firestore/types/post'
import { toDateText } from 'app/shared/helpers/toDateText'
import React, { Fragment, FunctionComponent } from 'react'

type Props = { post: Post }

const ListItemThread: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyles()

  return (
    <ListItem button divider>
      <ListItemText
        primary={post.text}
        secondaryTypographyProps={{
          className: classes.secondary,
          component: 'div'
        }}
        secondary={
          <Fragment>
            <Typography variant={'caption'}>
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

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    secondary: {
      display: 'grid',
      gridGap: spacing(0.5),
      gridAutoColumns: 'max-content',
      gridAutoFlow: 'column',
      justifyContent: 'space-between'
    }
  }
})

export default ListItemThread

import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import { Theme } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { WithStyles } from '@material-ui/styles/withStyles'
import { firestore } from 'firebase/app'
import React, { Component } from 'react'
import { collectionData } from 'rxfire/firestore'
import { Subscription } from 'rxjs'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { Post } from '../interfaces/models/post/post'
import { pct } from '../libs/styles/pct'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    root: { width: pct(100) },
    progress: { marginTop: spacing.unit * 2, textAlign: 'center' }
  })
}

interface Props extends WithStyles<typeof styles> {
  postId: string
  replyPostCount: number
}

interface State {
  posts: Post[]
  inProgress: boolean
}

class ListReplyPost extends Component<Props, State> {
  public state = { posts: [], inProgress: this.props.replyPostCount > 0 }

  private subscription?: Subscription

  render() {
    const { classes } = this.props
    const { posts, inProgress } = this.state as State

    if (inProgress) {
      return (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      )
    }

    if (!posts.length) {
      return null
    }

    return (
      <Fade in>
        <List className={classes.root}>
          {posts.map(post => (
            <ListItem key={post.id} button>
              <ListItemText>{post.text}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Fade>
    )
  }

  componentDidMount() {
    const { postId, replyPostCount } = this.props

    setTimeout(
      () => {
        const query = firestore()
          .collection(POSTS_AS_ANONYM)
          .doc(postId)
          .collection(POSTS)
          .limit(24)
          .orderBy('createdAt', DESC)
        this.subscription = collectionData(query).subscribe((docs: any) => {
          docs.reverse()
          this.setState({ inProgress: false, posts: docs })
        })
      },
      replyPostCount > 0 ? 400 : 0
    )
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}

export default withStyles(styles)(ListReplyPost)

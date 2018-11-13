import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React from 'react'
import { POSTS, POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { pct } from '../libs/styles/pct'

class Component extends React.Component<any, any> {
  isUnmounted = false
  unsubscribe = null

  state = { posts: [], inProgress: this.props.replyPostCount > 0 }

  render() {
    const { classes } = this.props
    const { posts, inProgress } = this.state

    if (inProgress) {
      return (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      )
    }

    return (
      Boolean(posts.length) && (
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
    )
  }

  componentDidMount() {
    const { postId, replyPostCount } = this.props

    setTimeout(() => {
      if (this.isUnmounted) return
      this.unsubscribe = firestore()
        .collection(POSTS_AS_ANONYM)
        .doc(postId)
        .collection(POSTS)
        .limit(8)
        .orderBy('createdAt', DESC)
        .onSnapshot(querySnapshot => {
          if (this.isUnmounted) return
          const docs = querySnapshot.docs
          docs.reverse()
          const posts = docs.map(doc => {
            const data = doc.data()
            return { ...data }
          })
          this.setState({ inProgress: false, posts })
        })
    }, replyPostCount > 0 ? 400 : 0)
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: { width: pct(100) },
    progress: { marginTop: spacing.unit * 2, textAlign: 'center' }
  })

export const ListReplyPost = withStyles(styles)(Component)

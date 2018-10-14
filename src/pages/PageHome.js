import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React, { Component, Fragment } from 'react'
import PostTextField from '../components/PostTextField'
import { POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import PostExpansionPanel from '../containers/PostExpansionPanel'
import { createdAt } from '../libs/createdAt'

class PageHome extends Component<any, any> {
  isUnmounted = false
  unsubscribe = null

  state = {
    posts: [],
    inProgress: true
  }

  render() {
    const { classes } = this.props
    const { posts, inProgress } = this.state

    return (
      <Fragment>
        <PostTextField />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <div className={classes.posts}>
              {posts.map(post => (
                <PostExpansionPanel key={post.id} post={post} />
              ))}
            </div>
          </Fade>
        )}
      </Fragment>
    )
  }

  componentDidMount() {
    this.unsubscribe = firestore()
      .collection(POSTS_AS_ANONYM)
      .limit(40)
      .orderBy('createdAt', DESC)
      .onSnapshot(querySnapshot => {
        const posts = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            ...data,
            ui: {
              createdAt: createdAt(data.createdAt.seconds)
            }
          }
        })
        if (this.isUnmounted) return
        this.setState({ posts, inProgress: false })
      })
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}

const styles = () => ({
  root: {},
  posts: {},
  progress: {
    display: 'block',
    marginTop: 80,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

export default withStyles(styles)(PageHome)

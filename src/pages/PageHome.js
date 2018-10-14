import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React, { Component, Fragment } from 'react'
import PostTextField from '../components/PostTextField'
import { POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import PostExpansionPanel from '../containers/PostExpansionPanel'
import { createdAt } from '../libs/createdAt'

type State = {}

class PageHome extends Component<any, State> {
  state = {
    posts: []
  }

  render() {
    const { classes } = this.props
    const { posts } = this.state

    return (
      <Fragment>
        <PostTextField />
        <div className={classes.posts}>
          {posts.map(post => (
            <PostExpansionPanel key={post.id} post={post} />
          ))}
        </div>
      </Fragment>
    )
  }

  componentDidMount() {
    firestore()
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
        this.setState({ posts })
      })
  }
}

const styles = () => ({
  root: {},
  posts: {}
})

export default withStyles(styles)(PageHome)

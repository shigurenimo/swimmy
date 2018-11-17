import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Tab from '@material-ui/core/Tab/Tab'
import Tabs from '@material-ui/core/Tabs/Tabs'
import { firestore } from 'firebase/app'
import React, { Fragment } from 'react'
import { collectionData } from 'rxfire/firestore'
import { POSTS_AS_THREAD } from '../constants/collection'
import { DESC } from '../constants/order'
import { CardThread } from '../containers/CardThread'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscription = null

  state = {
    posts: [],
    replyPosts: [],
    inProgressSubmit: true,
    inProgressReply: false,
    selectedPost: null,
    orderBy: 'updatedAt'
  }
  onChangeTab = (event, orderBy) => {
    this.setState({ orderBy, inProgressSubmit: true })
    this.subscribePosts(orderBy)
  }

  render() {
    const { classes } = this.props
    const { posts, inProgress } = this.state

    return (
      <Fragment>
        <Tabs
          value={this.state.orderBy}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.onChangeTab}
        >
          <Tab label="更新" value={'updatedAt'} />
          <Tab label="新着" value={'createdAt'} />
          <Tab label="評価数" value={'likeCount'} />
          <Tab label="レス数" value={'replyPostCount'} />
        </Tabs>
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <div className={classes.posts}>
              {posts.map(post => (
                <CardThread key={post.id} post={post} />
              ))}
            </div>
          </Fade>
        )}
      </Fragment>
    )
  }

  componentDidMount() {
    const { orderBy } = this.state

    this.subscription = this.subscribePosts(orderBy)
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  subscribePosts(orderBy: string) {
    const query = firestore()
      .collection(POSTS_AS_THREAD)
      .limit(100)
      .orderBy(orderBy, DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      this.setState({ posts, inProgressSubmit: false })
    })
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: {},
    progress: {
      display: 'block',
      marginTop: spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    posts: {
      display: 'grid',
      gridRowGap: px(spacing.unit * 2),
      marginTop: spacing.unit * 2,
      marginLeft: spacing.unit * 2,
      marginRight: spacing.unit * 2
    }
  })

export const PageThreads = withStyles(styles)(Component)

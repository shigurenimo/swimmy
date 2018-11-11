import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Tab from '@material-ui/core/Tab/Tab'
import Tabs from '@material-ui/core/Tabs/Tabs'
import { firestore } from 'firebase/app'
import React, { Fragment } from 'react'
import { collectionData } from 'rxfire/firestore'
import { POSTS_AS_IMAGE } from '../constants/collection'
import { DESC } from '../constants/order'
import { CardImages } from '../containers/CardImages'
import { createdAt } from '../libs/createdAt'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscription
  state = {
    posts: [],
    inProgress: true,
    orderBy: 'createdAt'
  }
  onChangeTab = (event, orderBy) => {
    this.setState({ orderBy, inProgress: true })
    this.updatePosts(orderBy)
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
          <Tab label="新着" value={'createdAt'} />
          <Tab label="更新" value={'updatedAt'} />
          <Tab label="書き込み数" value={'replyPostCount'} />
        </Tabs>
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <CardImages posts={posts} />
          </Fade>
        )}
      </Fragment>
    )
  }

  updatePosts(orderBy: string) {
    const query = firestore()
      .collection(POSTS_AS_IMAGE)
      .limit(100)
      .orderBy(orderBy, DESC)
    this.subscription = collectionData(query).subscribe(docs => {
      const posts = docs.map(doc => {
        return {
          ...doc,
          ui: { createdAt: createdAt(doc.createdAt) }
        }
      })
      if (this.isUnmounted) return
      this.setState({ posts, inProgress: false })
    })
  }

  componentDidMount() {
    const { orderBy } = this.state

    this.updatePosts(orderBy)
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
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
    }
  })

export const PageImages = withStyles(styles)(Component)

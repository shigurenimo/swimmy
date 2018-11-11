import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Tab from '@material-ui/core/Tab/Tab'
import Tabs from '@material-ui/core/Tabs/Tabs'
import { firestore } from 'firebase/app'
import React, { Fragment } from 'react'
import { POSTS_AS_IMAGE } from '../constants/collection'
import { DESC } from '../constants/order'
import { ImageCard } from '../containers/ImageCard'
import { createdAt } from '../libs/createdAt'

class Component extends React.Component<any, any> {
  isUnmounted = false

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
            <div className={classes.posts}>
              {posts.map(post => (
                <div key={post.id} className={classes.card}>
                  <ImageCard post={post} />
                </div>
              ))}
            </div>
          </Fade>
        )}
      </Fragment>
    )
  }

  updatePosts(orderBy: string) {
    firestore()
      .collection(POSTS_AS_IMAGE)
      .limit(100)
      .orderBy(orderBy, DESC)
      .get()
      .then(querySnapshot => {
        const posts = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            ...data,
            ui: {
              createdAt: createdAt(data.createdAt)
            }
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
    card: {
      marginTop: spacing.unit * 1.5,
      paddingLeft: spacing.unit * 1.5,
      paddingRight: spacing.unit * 1.5
    }
  })

export const PageImages = withStyles(styles)(Component)

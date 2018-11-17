import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React from 'react'
import { collectionData } from 'rxfire/firestore'
import { PageTitle } from '../components/PageTitle'
import { POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { ExpansionPanelPost } from '../containers/ExpansionPanelPost'
import { TextFieldPost } from '../containers/TextFieldPost'
import { createdAt } from '../libs/createdAt'
import { memory } from '../libs/memory'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscription = null

  state = { posts: [], inProgress: true }

  render() {
    const { classes } = this.props
    const { posts, inProgress } = this.state

    return (
      <main className={classes.root}>
        <PageTitle
          title={'スイミーにようこそ'}
          description={`はじめまして。スイミーは完全な匿名の電子掲示板です。
          ログインすることでSNSの真似事ができますが、SNSではないのでユーザと仲良くなることはありません。`}
        />
        <TextFieldPost />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <section className={classes.posts}>
              {posts.map(post => (
                <ExpansionPanelPost key={post.id} post={post} />
              ))}
            </section>
          </Fade>
        )}
      </main>
    )
  }

  componentDidMount() {
    const exists = this.restoreState()

    if (exists) {
      this.setState({ inProgress: false })
    }

    this.subscription = this.subscribePosts()
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.saveState()
  }

  subscribePosts() {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .limit(32)
      .orderBy('createdAt', DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      this.setState({ posts, inProgress: false })
    })
  }

  restoreState() {
    const { location } = this.props
    const state = memory.get(location.pathname)

    if (state) {
      console.info('restore', location.pathname)
      this.setState({ posts: state.posts })
    }

    return Boolean(state)
  }

  saveState() {
    const { posts } = this.state
    const { location } = this.props

    console.info('save', location.pathname)
    memory.set(location.pathname, { posts })
  }
}

const styles = ({ spacing }) =>
  createStyles({
    root: { display: 'grid' },
    progress: {
      display: 'block',
      marginTop: spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    posts: { display: 'grid' }
  })

export const PageHome = withStyles(styles)(Component)

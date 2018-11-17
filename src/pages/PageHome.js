import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { firestore } from 'firebase/app'
import React from 'react'
import { compose } from 'recompose'
import { collectionData } from 'rxfire/firestore'
import { ButtonMore } from '../components/ButtonMore'
import { PageTitle } from '../components/PageTitle'
import { POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import { ExpansionPanelPost } from '../containers/ExpansionPanelPost'
import { TextFieldPost } from '../containers/TextFieldPost'
import { withCache } from '../higher-order-components/withCache'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscription = null
  state = { posts: [], inProgress: true, inProgressMore: false, limit: 16 }
  onMore = () => {
    const { limit, inProgressMore } = this.state
    if (inProgressMore) return
    const nextLimit = limit + 16
    this.setState({ inProgressMore: true, limit: nextLimit })
    this.subscribePosts(nextLimit)
  }

  render() {
    const { classes } = this.props
    const { posts, inProgress, inProgressMore, limit } = this.state

    return (
      <main className={classes.root}>
        <PageTitle
          title={'スイミーにようこそ'}
          description={`はじめまして。スイミーは完全な匿名の電子掲示板です。
          ログインすることでSNSの真似事ができますが、SNSではないです。`}
        />
        <TextFieldPost />
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <section className={classes.section}>
              <ul className={classes.posts}>
                {posts.map(post => (
                  <ExpansionPanelPost key={post.id} post={post} />
                ))}
              </ul>
              {limit < 120 && (
                <ButtonMore onClick={this.onMore} inProgress={inProgressMore} />
              )}
            </section>
          </Fade>
        )}
      </main>
    )
  }

  componentDidMount() {
    const state = this.restoreState()
    const limit = state ? state.limit : 16
    this.subscription = this.subscribePosts(limit)
  }

  componentWillUnmount() {
    this.isUnmounted = true

    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    this.saveState()
  }

  subscribePosts(limit = 16) {
    const query = firestore()
      .collection(POSTS_AS_ANONYM)
      .limit(limit)
      .orderBy('createdAt', DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      this.setState({ posts, inProgress: false, inProgressMore: false })
    })
  }

  restoreState() {
    const { cache } = this.props

    const state = cache.restore()

    if (state) {
      this.setState({
        posts: state.posts,
        limit: state.limit,
        inProgress: false
      })
    }

    return state
  }

  saveState() {
    const { posts, limit } = this.state
    const { cache } = this.props

    cache.save({ posts, limit })
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
    posts: { display: 'grid', margin: 0, paddingLeft: 0 },
    section: { display: 'grid', gridRowGap: px(spacing.unit * 2) }
  })

export const PageHome = compose(
  withCache,
  withStyles(styles)
)(Component)

import { Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { WithStyles } from '@material-ui/styles/withStyles'
import { firestore } from 'firebase/app'
import React, { Component } from 'react'
import { collectionData } from 'rxfire/firestore'
import { Subscription } from 'rxjs'
import ButtonMore from '../components/ButtonMore'
import PageTitle from '../components/PageTitle'
import { POSTS_AS_ANONYM } from '../constants/collection'
import { DESC } from '../constants/order'
import ExpansionPanelPost from '../components/ExpansionPanelPost'
import TextFieldPost from '../components/TextFieldPost'
import { withCache } from '../higher-order-components/withCache'
import { Post } from '../interfaces/models/post/post'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

const styles = ({ spacing }: Theme) => {
  return createStyles({
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
}

interface Props extends WithStyles<typeof styles> {
  cache: any
}

interface State {
  posts: PostUi[]
  inProgress: boolean
  inProgressMore: boolean
  limit: number
}

class PageHome extends Component<Props> {
  public state: State = {
    posts: [],
    inProgress: true,
    inProgressMore: false,
    limit: 16
  }

  private isUnmounted = false
  private subscription?: Subscription

  public render() {
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
    return collectionData<Post>(query).subscribe(docs => {
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

  private onMore = () => {
    const { limit, inProgressMore } = this.state
    if (inProgressMore) return
    const nextLimit = limit + 16
    this.setState({ inProgressMore: true, limit: nextLimit })
    this.subscribePosts(nextLimit)
  }
}

export default withCache(withStyles(styles)(PageHome))

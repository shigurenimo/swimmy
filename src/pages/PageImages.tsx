import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import { Theme } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { createStyles, withStyles, WithStyles } from '@material-ui/styles'
import { firestore } from 'firebase/app'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { collectionData } from 'rxfire/firestore'
import { Subscription } from 'rxjs'
import ButtonMore from '../components/ButtonMore'
import PageTitle from '../components/PageTitle'
import CardImages from '../components/UlImages'
import { POSTS_AS_IMAGE } from '../constants/collection'
import { DESC } from '../constants/order'
import { withCache } from '../higher-order-components/withCache'
import { Post } from '../interfaces/models/post/post'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

const styles = ({ spacing }: Theme) => {
  return createStyles({
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.unit * 10
    },
    root: { display: 'grid', gridRowGap: px(spacing.unit * 2) },
    section: { display: 'grid', gridRowGap: px(spacing.unit * 2) }
  })
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  cache: any
}

interface State {
  posts: PostUi[]
  inProgress: boolean
  inProgressMore: boolean
  orderBy: string
  limit: number
}

class PageImages extends Component<Props> {
  public state: State = {
    inProgress: true,
    inProgressMore: false,
    limit: 16,
    orderBy: 'createdAt',
    posts: []
  }

  private isUnmounted = false
  private subscription?: Subscription

  public render() {
    const { classes } = this.props
    const { posts, inProgress, inProgressMore, limit } = this.state
    return (
      <main className={classes.root}>
        <PageTitle
          title={'フォトグラフィ'}
          description={'画像の添付された書き込みはここに表示されます。'}
        />
        <Tabs
          value={this.state.orderBy}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.onChangeTab}
        >
          <Tab label="新着" value={'createdAt'} />
          <Tab label="評価数" value={'likeCount'} />
          <Tab label="レス数" value={'replyPostCount'} />
        </Tabs>
        {inProgress && <CircularProgress className={classes.progress} />}
        {!inProgress && (
          <Fade in>
            <section className={classes.section}>
              <CardImages posts={posts} />
              {limit < 200 && (
                <ButtonMore onClick={this.onMore} inProgress={inProgressMore} />
              )}
            </section>
          </Fade>
        )}
      </main>
    )
  }

  public componentDidMount() {
    const orderBy = this.getOrderBy()
    const state = this.restoreState()
    const limit = state ? state.limit : 16
    this.setState({ orderBy })
    this.subscription = this.subscribePosts(orderBy, limit)
  }

  public componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.saveState()
  }

  public saveState() {
    const { posts, limit } = this.state
    const { cache } = this.props
    cache.save({ posts, limit })
  }

  private onMore = () => {
    const { limit, inProgressMore, orderBy } = this.state
    if (inProgressMore) {
      return
    }
    const nextLimit = limit + 16
    this.setState({ inProgressMore: true, limit: nextLimit })
    this.subscribePosts(orderBy, nextLimit)
  }

  private onChangeTab = (_: any, orderBy: string) => {
    const { history } = this.props
    history.push(`?order=${orderBy}`)
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.subscription = this.subscribePosts(orderBy)
    this.setState({ orderBy, inProgress: true })
    this.saveState()
  }

  private subscribePosts(orderBy: string, limit = 16) {
    const query = firestore()
      .collection(POSTS_AS_IMAGE)
      .limit(limit)
      .orderBy(orderBy, DESC)
    return collectionData<Post>(query).subscribe(docs => {
      if (this.isUnmounted) {
        return
      }
      const posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      this.setState({ posts, inProgress: false, inProgressMore: false })
    })
  }

  private getOrderBy() {
    const { location } = this.props
    switch (location.search.replace('?order=', '')) {
      case 'createdAt':
        return 'createdAt'
      case 'likeCount':
        return 'likeCount'
      case 'replyPostCount':
        return 'replyPostCount'
      default:
        return 'createdAt'
    }
  }

  private restoreState() {
    const { cache } = this.props
    const state = cache.restore()
    if (state) {
      this.setState({
        inProgress: false,
        limit: state.limit,
        posts: state.posts
      })
    }
    return state
  }
}

export default withCache(withStyles(styles)(PageImages))

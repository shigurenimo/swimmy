import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import Fade from '@material-ui/core/Fade/Fade'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import Tab from '@material-ui/core/Tab/Tab'
import Tabs from '@material-ui/core/Tabs/Tabs'
import { firestore } from 'firebase/app'
import React from 'react'
import { compose } from 'recompose'
import { collectionData } from 'rxfire/firestore'
import { ButtonMore } from '../components/ButtonMore'
import { CardImages } from '../components/CardImages'
import { PageTitle } from '../components/PageTitle'
import { POSTS_AS_IMAGE } from '../constants/collection'
import { DESC } from '../constants/order'
import { withCache } from '../higher-order-components/withCache'
import { createdAt } from '../libs/createdAt'
import { px } from '../libs/styles/px'

class Component extends React.Component<any, any> {
  isUnmounted = false
  subscription = null
  state = {
    posts: [],
    inProgress: true,
    inProgressMore: false,
    orderBy: 'updatedAt',
    limit: 16
  }
  onMore = () => {
    const { limit, inProgressMore, orderBy } = this.state
    if (inProgressMore) return
    const nextLimit = limit + 16
    this.setState({ inProgressMore: true, limit: nextLimit })
    this.subscribePosts(orderBy, nextLimit)
  }
  onChangeTab = (event, orderBy) => {
    const { history } = this.props

    history.push(`?order=${orderBy}`)

    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    this.subscription = this.subscribePosts(orderBy)
    this.setState({ orderBy, inProgress: true })
    this.saveState()
  }

  render() {
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
          component={'nav'}
        >
          <Tab label="更新" value={'updatedAt'} />
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

  componentDidMount() {
    const orderBy = this.getOrderBy()
    const state = this.restoreState()
    const limit = state ? state.limit : 16
    this.setState({ orderBy })
    this.subscription = this.subscribePosts(orderBy, limit)
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.saveState()
  }

  subscribePosts(orderBy: string, limit = 16) {
    const query = firestore()
      .collection(POSTS_AS_IMAGE)
      .limit(limit)
      .orderBy(orderBy, DESC)
    return collectionData(query).subscribe(docs => {
      if (this.isUnmounted) return
      const posts = docs.map(doc => {
        return { ...doc, ui: { createdAt: createdAt(doc.createdAt) } }
      })
      this.setState({ posts, inProgress: false, inProgressMore: false })
    })
  }

  getOrderBy() {
    const { location } = this.props

    switch (location.search.replace('?order=', '')) {
      case 'createdAt':
        return 'createdAt'
      case 'likeCount':
        return 'likeCount'
      case 'replyPostCount':
        return 'replyPostCount'
      default:
        return 'updatedAt'
    }
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
    root: { display: 'grid', gridRowGap: px(spacing.unit * 2) },
    progress: {
      display: 'block',
      marginTop: spacing.unit * 10,
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    section: { display: 'grid', gridRowGap: px(spacing.unit * 2) }
  })

export const PageImages = compose(
  withCache,
  withStyles(styles)
)(Component)

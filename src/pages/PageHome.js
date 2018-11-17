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

  state = { posts: [], inProgressSubmit: true }

  render() {
    const { classes } = this.props
    const { posts, inProgress } = this.state

    return (
      <main className={classes.root}>
        <PageTitle
          title={'タイムライン'}
          description={
            'レス以外の書き込みはこのページに表示されます。' +
            '書き込みを選択すると評価やレスが表示されます。'
          }
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
    this.subscription = this.subscribePosts()
    this.onSave()
  }

  componentWillUnmount() {
    this.isUnmounted = true
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.onRestore()
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
      this.setState({ posts, inProgressSubmit: false })
    })
  }

  onSave() {
    const data = memory.get('pages/PageHome:default')
    if (data) {
      this.setState({ posts: data.posts })
    }
  }

  onRestore() {
    const { posts } = this.state
    memory.set('pages/PageHome:default', { posts })
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

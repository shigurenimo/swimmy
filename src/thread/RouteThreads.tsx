import { CircularProgress, Divider, Tab, Tabs, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../components/AppBarDefault'
import ButtonMore from '../components/ButtonMore'
import FragmentHead from '../components/FragmentHead'
import { px } from '../styles/px'
import { WORD_RESPONSE } from '../text/word'
import CardThread from './components/CardThread'
import { useOrderBy } from './hooks/useOrderBy'
import { useThreads } from './hooks/useThreads'
import { useThreadsLimit } from './hooks/useThreadsLimit'

const RouteThreads: FunctionComponent = () => {
  const history = useHistory()

  const [limit, setLimit] = useThreadsLimit()

  const orderBy = useOrderBy()

  const [posts] = useThreads(limit, orderBy)

  const [loading, setLoading] = useState(posts.length === 0)

  const classes = useStyles({})

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const onLoadNext = () => {
    setLoading(true)
    setLimit(_limit => _limit + 16)
  }

  const onChangeTab = (_: ChangeEvent<{}>, _orderBy: string) => {
    history.push(`?order=${_orderBy}`)
  }

  const renderLoading = loading && posts.length === 0

  const renderNext = posts.length !== 0 && limit < 400

  return (
    <Fragment>
      <FragmentHead title={`${WORD_RESPONSE}のある書き込み一覧です`} />
      <Header />
      <main className={classes.root}>
        <Tabs
          indicatorColor={'primary'}
          onChange={onChangeTab}
          textColor={'primary'}
          value={orderBy}
        >
          <Tab label={'新着'} value={'createdAt'} />
          <Tab label={'評価数'} value={'likeCount'} />
          <Tab label={`${WORD_RESPONSE}数`} value={'replyPostCount'} />
        </Tabs>
        {renderLoading && <CircularProgress className={classes.progress} />}
        <section className={classes.section}>
          <ul className={classes.posts}>
            {posts.map(post => (
              <li key={post.id}>
                <CardThread post={post} />
                <Divider />
              </li>
            ))}
          </ul>
          {renderNext && (
            <ButtonMore onClick={onLoadNext} inProgress={loading} />
          )}
        </section>
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    posts: { display: 'grid' },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10),
    },
    root: { display: 'grid', gridRowGap: px(spacing(2)) },
    section: { display: 'grid', gridRowGap: px(spacing(2)) },
  }
})

export default RouteThreads

import { Divider, Tab, Tabs, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import AppBarDefault from '../core/AppBarDefault'
import ButtonMore from '../common/ButtonMore'
import FragmentHead from '../web/FragmentHead'
import ToolbarDefault from '../layout/ToolbarDefault'
import { useSearchOrderBy } from '../hooks/useSearchOrderBy'
import DivCenter from '../layout/DivCenter'
import ListItemSkeleton from '../skeleton/ListItemSkeleton'
import { WORD_RESPONSE } from '../text/word'
import CardThread from './components/CardThread'
import { useThreads } from './hooks/useThreads'
import { useThreadsLimit } from './hooks/useThreadsLimit'

const RouteThreads: FunctionComponent = () => {
  const history = useHistory()

  const orderBy = useSearchOrderBy()

  const [limit, setLimit] = useThreadsLimit(orderBy)

  const [posts] = useThreads(limit, orderBy)

  const [loading, setLoading] = useState(posts.length === 0)

  const classes = useStyles()

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

  const skeletons = loading && posts.length === 0 ? [0, 1, 2, 3, 4, 5, 6] : []

  const hasNext = posts.length !== 0 && limit < 400

  return (
    <Fragment>
      <FragmentHead title={`${WORD_RESPONSE}のある書き込み一覧です`} />
      <AppBarDefault />
      <ToolbarDefault />
      <main className={classes.root}>
        <Tabs
          indicatorColor={'primary'}
          onChange={onChangeTab}
          textColor={'primary'}
          value={orderBy}
        >
          <Tab label={'新着'} value={'created_at'} />
          <Tab label={`${WORD_RESPONSE}数`} value={'reply_count'} />
        </Tabs>
        {skeletons.map(n => (
          <ListItemSkeleton key={n} />
        ))}
        <section className={classes.section}>
          <ul className={classes.posts}>
            {posts.map(post => (
              <li key={post.id}>
                <CardThread post={post} />
                <Divider />
              </li>
            ))}
          </ul>
          {hasNext && (
            <DivCenter>
              <ButtonMore onClick={onLoadNext} inProgress={loading} />
            </DivCenter>
          )}
        </section>
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    posts: { display: 'grid' },
    root: { display: 'grid' },
    section: { display: 'grid', gridRowGap: spacing(2) },
  }
})

export default RouteThreads

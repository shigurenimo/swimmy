import { Tab, Tabs, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useEffect,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import AppBarDefault from '../components/AppBarDefault'
import ButtonMore from '../components/ButtonMore'
import FragmentHead from '../components/FragmentHead'
import ToolbarDefault from '../components/ToolbarDefault'
import { useSearchOrderBy } from '../hooks/useSearchOrderBy'
import { WORD_PHOTO, WORD_RESPONSE } from '../text/word'
import CardImage from './components/CardImage'
import { useImages } from './hooks/useImages'
import { useImagesLimit } from './hooks/useImagesLimit'

const RouteImages: FunctionComponent = () => {
  const history = useHistory()

  const orderBy = useSearchOrderBy()

  const [limit, setLimit] = useImagesLimit(orderBy)

  const [posts] = useImages(limit, orderBy)

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

  const hasNext = posts.length !== 0 && limit < 400

  return (
    <Fragment>
      <FragmentHead
        title={WORD_PHOTO}
        description={`${WORD_PHOTO}の添付された書き込みです。`}
      />
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
        <section className={classes.section}>
          <ul className={classes.ul}>
            {posts.map(post => (
              <li key={post.id}>
                <CardImage post={post} />
              </li>
            ))}
          </ul>
          {hasNext && <ButtonMore onClick={onLoadNext} inProgress={loading} />}
        </section>
      </main>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ breakpoints, spacing }) => {
  return {
    root: { display: 'grid', gridRowGap: spacing(2) },
    section: { display: 'grid', gridRowGap: spacing(2) },
    ul: {
      alignItems: 'center',
      display: 'grid',
      gridColumnGap: spacing(2),
      gridRowGap: spacing(2),
      margin: 0,
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      [breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
      [breakpoints.up('md')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
      [breakpoints.up('lg')]: { gridTemplateColumns: 'repeat(4, 1fr)' },
    },
  }
})

export default RouteImages

import { CircularProgress, Divider, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent, useEffect, useState } from 'react'
import ButtonMore from '../../components/ButtonMore'
import TextFieldPost from '../../components/TextFieldPost'
import { px } from '../../styles/px'
import { useHomeLimit } from '../hooks/useHomeLimit'
import { useHomePosts } from '../hooks/useHomePosts'
import CardPost from './CardPost'

const MainHome: FunctionComponent = () => {
  const [limit, setLimit] = useHomeLimit()

  const [posts] = useHomePosts(limit)

  const [loading, setLoading] = useState(true)

  const classes = useStyles()

  const onLoadNext = () => {
    setLoading(true)
    setLimit(_limit => _limit + 32)
  }

  useEffect(() => {
    if (posts.length === 0) return
    setLoading(false)
  }, [posts.length])

  const renderLoading = loading && posts.length === 0

  const renderNext = posts.length !== 0 && limit < 400

  return (
    <main className={classes.main}>
      <TextFieldPost />
      {renderLoading && <CircularProgress className={classes.progress} />}
      <section className={classes.section}>
        <ul className={classes.posts}>
          {posts.map((post, index) => (
            <li key={post.id}>
              <CardPost post={post} />
              <Divider />
            </li>
          ))}
        </ul>
        {renderNext && <ButtonMore onClick={onLoadNext} inProgress={loading} />}
      </section>
    </main>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return {
    main: { display: 'grid' },
    posts: { display: 'grid', margin: 0, paddingLeft: 0 },
    progress: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing(10),
    },
    section: { display: 'grid', gridRowGap: px(spacing(2)) },
  }
})

export default MainHome

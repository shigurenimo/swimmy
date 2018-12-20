import Search from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

const PageSearch = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <UnderDevelopment
        Icon={Search}
        title={'フルテキスト検索'}
        description={'過去の書き込みから全文検索できる機能を開発しています。'}
      />
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return { root: { paddingTop: spacing.unit * 10 } }
})

export default PageSearch

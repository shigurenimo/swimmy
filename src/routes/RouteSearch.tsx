import Search from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

const RouteSearch: FunctionComponent = () => {
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
  return { root: { paddingTop: spacing(10) } }
})

export default RouteSearch

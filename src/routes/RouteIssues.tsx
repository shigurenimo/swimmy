import BugReport from '@material-ui/icons/BugReport'
import { makeStyles } from '@material-ui/styles'
import React, { FunctionComponent } from 'react'
import UnderDevelopment from '../components/UnderDevelopment'

const RouteIssues: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <UnderDevelopment
        Icon={BugReport}
        title={'バグレポート'}
        description={'機能の提案やバグの報告ができる機能を開発しています。'}
      />
    </div>
  )
}

const useStyles = makeStyles(({ spacing }) => {
  return { root: { paddingTop: spacing(10) } }
})

export default RouteIssues

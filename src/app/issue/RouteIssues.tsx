import { Theme } from '@material-ui/core'
import BugReport from '@material-ui/icons/BugReport'
import { makeStyles } from '@material-ui/styles'
import DivUnderDevelopment from 'app/shared/components/DivUnderDevelopment'
import FragmentHead from 'app/shared/components/FragmentHead'
import React, { Fragment, FunctionComponent } from 'react'

const RouteIssues: FunctionComponent = () => {
  const classes = useStyles({})

  return (
    <Fragment>
      <FragmentHead />
      <div className={classes.root}>
        <DivUnderDevelopment
          Icon={BugReport}
          title={'バグレポート'}
          description={'機能の提案やバグの報告ができる機能を開発しています。'}
        />
      </div>
    </Fragment>
  )
}

const useStyles = makeStyles<Theme>(({ spacing }) => {
  return { root: { paddingTop: spacing(10) } }
})

export default RouteIssues

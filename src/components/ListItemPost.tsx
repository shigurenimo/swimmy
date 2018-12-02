import { Theme } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import makeStyles from '@material-ui/styles/makeStyles'
import { WithStyles } from '@material-ui/styles/withStyles'
import React, { Component, FunctionComponent } from 'react'
import ExpansionPanelSummaryPost from './ExpansionPanelSummaryPost'
import { PostUi } from '../interfaces/models/post/postWithUi'
import { px } from '../libs/styles/px'

const useStyle = makeStyles(({ spacing }) => {
  return {
    root: { padding: px(spacing.unit * 2) }
  }
})

interface Props {
  post: PostUi
}

const ListItemPost: FunctionComponent<Props> = ({ post }) => {
  const classes = useStyle({})

  return (
    <div className={classes.root}>
      <ExpansionPanelSummaryPost post={post} />
    </div>
  )
}

export default ListItemPost

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component } from 'react'
import PostAsReplyList from '../components/PostAsReplyList'
import PostAsReplyTextField from '../components/PostAsReplyTextField'
import PostExpansionPanelSummary from '../components/PostExpansionPanelSummary'

class PostExpansionPanel extends Component<any, any> {
  state = {
    expanded: false
  }

  render() {
    const { classes, post } = this.props
    const { expanded } = this.state

    return (
      <ExpansionPanel expanded={expanded}>
        <ExpansionPanelSummary
          className={classes.summary}
          onClick={this.onClickPanelSummary}
        >
          <PostExpansionPanelSummary post={post} />
        </ExpansionPanelSummary>
        {/* <PostActions /> */}
        {expanded && (
          <PostAsReplyList
            postId={post.id}
            replyPostCount={post.replyPostCount}
          />
        )}
        <PostAsReplyTextField postId={post.id} />
      </ExpansionPanel>
    )
  }

  onClickPanelSummary = event => {
    if (event.target.tagName !== 'SPAN') {
      this.setState(state => ({ expanded: !state.expanded }))
    }
  }
}

const styles = theme => ({
  root: {
    width: '100%'
  },
  summary: {
    padding: '0 12px'
  },
  summaryContentInner: {
    paddingRight: '0 !important',
    width: '100%'
  },
  text: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightMedium
  },
  replyPostCount: {
    paddingLeft: 8,
    color: theme.palette.secondary.light
  }
})

export default withStyles(styles)(PostExpansionPanel)

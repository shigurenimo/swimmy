import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import withStyles from '@material-ui/core/styles/withStyles'
import React, { Component } from 'react'
import PostActions from '../components/PostActions'
import PostAsReplyList from '../components/PostAsReplyList'
import PostAsReplyTextField from '../components/PostAsReplyTextField'
import PostExpansionPanelSummary from '../components/PostExpansionPanelSummary'

class PostExpansionPanel extends Component<any, any> {
  state = {
    expanded: false
  }

  render() {
    const { classes, post, selectPost } = this.props
    const { expanded } = this.state

    return (
      <ExpansionPanel expanded={expanded}>
        <ExpansionPanelSummary
          className={classes.summary}
          onClick={this.onClickPanelSummary}
        >
          <PostExpansionPanelSummary post={post} />
        </ExpansionPanelSummary>
        <PostActions selectPost={selectPost} postId={post.id} />
        {expanded && (
          <PostAsReplyList
            postId={post.id}
            replyPostCount={post.replyPostCount}
          />
        )}
        <div className={classes.textField}>
          <PostAsReplyTextField postId={post.id} />
        </div>
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
  textField: {
    marginTop: 8
  }
})

export default withStyles(styles)(PostExpansionPanel)

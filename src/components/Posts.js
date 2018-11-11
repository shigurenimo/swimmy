import React from 'react'
import { ExpansionPanelPost } from '../containers/ExpansionPanelPost'

export const Component = ({ posts, selectPost }) => {
  return (
    <div>
      {posts.map(post => (
        <ExpansionPanelPost key={post.id} post={post} selectPost={selectPost} />
      ))}
    </div>
  )
}

export const Posts = Component

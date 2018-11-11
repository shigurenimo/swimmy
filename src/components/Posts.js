import React from 'react'
import { PostExpansionPanel } from '../containers/PostExpansionPanel'

export const Component = ({ posts, selectPost }) => {
  return (
    <div>
      {posts.map(post => (
        <PostExpansionPanel key={post.id} post={post} selectPost={selectPost} />
      ))}
    </div>
  )
}

export const Posts = Component

import { gql } from "@apollo/client"

export default gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      createdAt
      text
      fileIds
      likesCount
      repliesCount
      reactions {
        id
        text
        count
        secretCount
        isConnected
      }
      isDeleted
    }
  }
`

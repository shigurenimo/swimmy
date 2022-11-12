import { gql } from "@apollo/client"

export default gql`
  query Thread($threadId: ID!) {
    thread(threadId: $threadId) {
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

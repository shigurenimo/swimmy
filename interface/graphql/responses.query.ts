import { gql } from "@apollo/client"

export default gql`
  query Responses($threadId: ID!) {
    responses(threadId: $threadId) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
    }
  }
`

import { gql } from "@apollo/client"

export default gql`
  query Threads($after: ID) {
    threads(after: $after) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
    }
  }
`

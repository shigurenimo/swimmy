import { gql } from "@apollo/client"

export default gql`
  mutation AddReaction($input: AddReactionInput!) {
    addReaction(input: $input) {
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

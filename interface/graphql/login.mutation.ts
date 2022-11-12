import { gql } from "@apollo/client"

export default gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`

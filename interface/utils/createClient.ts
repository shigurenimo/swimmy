import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { relayStylePagination } from "@apollo/client/utilities"

export const createClient = () => {
  const httpLink = createHttpLink({
    uri: "/api/graphql",
  })


  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: relayStylePagination(),
          threads: relayStylePagination(),
        },
      },
    },
  })

  return new ApolloClient({
    link: httpLink,
    cache: cache,
  })
}

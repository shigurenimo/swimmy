import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { relayStylePagination } from "@apollo/client/utilities"
import { getAntiCSRFToken } from "@blitzjs/auth"

export const createClient = () => {
  const httpLink = createHttpLink({
    uri: "/api/graphql",
  })

  const authLink = setContext((_, context) => {
    const token = getAntiCSRFToken()
    return {
      headers: {
        ...context.headers,
        "anti-csrf": token,
      },
    }
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
    link: authLink.concat(httpLink),
    cache: cache,
  })
}

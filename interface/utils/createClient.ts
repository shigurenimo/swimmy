import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { relayStylePagination } from "@apollo/client/utilities"
import { getAuth } from "firebase/auth"

export const createClient = () => {
  const httpLink = createHttpLink({
    uri: "/api/graphql",
  })

  const authLink = setContext(async (_, context) => {
    const auth = getAuth()
    const user = auth.currentUser
    const token = user ? await user.getIdToken() : null
    return {
      headers: {
        ...context.headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
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

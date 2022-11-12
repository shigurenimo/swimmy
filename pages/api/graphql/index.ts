import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { getSession } from "@blitzjs/auth"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { loadSchemaSync } from "@graphql-tools/load"
import { addResolversToSchema } from "@graphql-tools/schema"
import { resolvers } from "interface/resolvers"

const schema = loadSchemaSync("interface/schema.graphql", {
  loaders: [new GraphQLFileLoader()],
})

const server = new ApolloServer({
  schema: addResolversToSchema({ schema, resolvers }),
  introspection: true,
})

export default startServerAndCreateNextHandler(server, {
  async context(req, res) {
    if (req.body.operationName === "IntrospectionQuery") {
      return {}
    }
    const session = await getSession(req, res)
    return { session }
  },
})

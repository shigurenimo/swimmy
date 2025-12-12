import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { loadSchemaSync } from "@graphql-tools/load"
import { addResolversToSchema } from "@graphql-tools/schema"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { resolvers } from "interface/resolvers"
import type { Session } from "types"

const schema = loadSchemaSync("interface/schema.graphql", {
  loaders: [new GraphQLFileLoader()],
})

const server = new ApolloServer({
  schema: addResolversToSchema({ schema, resolvers }),
  introspection: true,
})

const initFirebaseAdmin = () => {
  if (getApps().length > 0) return
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

export default startServerAndCreateNextHandler(server, {
  async context(req) {
    try {
      if (req.body.operationName === "IntrospectionQuery") {
        return { session: null }
      }

      const authHeader = req.headers.authorization
      if (!authHeader?.startsWith("Bearer ")) {
        return { session: null }
      }

      const token = authHeader.split("Bearer ")[1]
      if (!token) {
        return { session: null }
      }

      initFirebaseAdmin()
      const decodedToken = await getAuth().verifyIdToken(token)

      const session: Session = {
        userId: decodedToken.uid,
        role: null,
      }

      return { session }
    } catch (error) {
      return { session: null }
    }
  },
})

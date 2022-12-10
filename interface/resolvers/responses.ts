import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import { container } from "tsyringe"
import { QueryResolvers } from "interface/__generated__/node"
import { ReadResponsesQuery } from "service"

export const responses: QueryResolvers["responses"] = async (_, args) => {
  const query = container.resolve(ReadResponsesQuery)

  const nodes = await query.execute({
    threadId: args.threadId,
  })

  if (nodes instanceof Error) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    })
  }

  const pageInfo = {
    endCursor: null,
    hasNextPage: false,
  }

  return {
    totalCount: nodes.length,
    pageInfo,
    edges: nodes.map((node) => {
      return {
        cursor: node.id,
        node: node,
      }
    }),
    nodes: nodes,
  }
}

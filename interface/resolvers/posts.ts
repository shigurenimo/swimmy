import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import { container } from "tsyringe"
import { CountPostsQuery, ReadPostsQuery } from "application"
import { QueryResolvers } from "interface/__generated__/node"

export const posts: QueryResolvers["posts"] = async (_, args) => {
  const take = 2

  const query = container.resolve(ReadPostsQuery)

  const nodes = await query.execute({
    userId: null,
    take: take,
    cursor: args.after ?? null,
  })

  if (nodes instanceof Error) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    })
  }

  const countQuery = container.resolve(CountPostsQuery)

  const count = await countQuery.execute()

  if (count instanceof Error) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    })
  }

  const pageInfo = {
    endCursor: nodes.length < take ? null : nodes[nodes.length - 1]?.id,
    hasNextPage: take <= nodes.length,
  }

  return {
    totalCount: count,
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

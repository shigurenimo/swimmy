import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import { container } from "tsyringe"
import { QueryResolvers } from "interface/__generated__/node"
import { CountPostsQuery, ReadPrivatePostsQuery } from "service"

export const feed: QueryResolvers["feed"] = async (_, args, ctx) => {
  const take = 40

  if (ctx.session === null || ctx.session.userId === null) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.BAD_REQUEST },
    })
  }

  const query = container.resolve(ReadPrivatePostsQuery)

  const nodes = await query.execute({
    userId: ctx.session?.userId,
    cursor: args.after ?? null,
    take: take,
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

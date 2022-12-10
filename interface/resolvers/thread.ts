import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import { container } from "tsyringe"
import { QueryResolvers } from "interface/__generated__/node"
import { ReadPostQuery } from "service"

export const thread: QueryResolvers["thread"] = async (_, args) => {
  const query = container.resolve(ReadPostQuery)

  const node = await query.execute({
    postId: args.threadId,
    userId: null,
  })

  if (node instanceof Error) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.BAD_REQUEST },
    })
  }

  return node
}

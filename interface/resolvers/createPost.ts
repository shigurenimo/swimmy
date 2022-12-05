import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import { container } from "tsyringe"
import { CreatePostService, ReadPostQuery } from "application"
import { MutationResolvers } from "interface/__generated__/node"

export const createPost: MutationResolvers["createPost"] = async (
  _,
  args,
  ctx
) => {
  const command = container.resolve(CreatePostService)

  const output = await command.execute({
    userId: null,
    threadId: args.input.threadId ?? null,
    fileIds: args.input.fileIds,
    text: args.input.text,
  })

  if (output instanceof Error) {
    throw output
  }

  const query = container.resolve(ReadPostQuery)

  const node = await query.execute({
    postId: output.postId,
    userId: ctx.session?.userId ?? null,
  })

  if (node instanceof Error) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    })
  }

  return node
}

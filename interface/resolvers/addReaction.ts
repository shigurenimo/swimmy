import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import { container } from "tsyringe"
import {
  CreateReactionService,
  CreateSecretReactionService,
  ReadPostQuery,
} from "application"
import { MutationResolvers } from "interface/__generated__/node"

export const addReaction: MutationResolvers["addReaction"] = async (
  _,
  args,
  ctx
) => {
  if (ctx.session === null) {
    const command = container.resolve(CreateSecretReactionService)
    await command.execute({
      text: args.input.text,
      postId: args.input.postId,
    })
  }

  if (ctx.session !== null && ctx.session.userId !== null) {
    const command = container.resolve(CreateReactionService)
    await command.execute({
      text: args.input.text,
      userId: ctx.session.userId,
      postId: args.input.postId,
    })
  }

  const query = container.resolve(ReadPostQuery)

  const node = await query.execute({
    postId: args.input.postId,
    userId: ctx.session?.userId ?? null,
  })

  if (node instanceof Error) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    })
  }

  return node
}

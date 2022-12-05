import { MutationResolvers } from "interface/__generated__/node"

export const logout: MutationResolvers["logout"] = async (_, args, ctx) => {
  await ctx.session?.$revoke()

  return null
}

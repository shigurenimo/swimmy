import { withSentry } from "app/interface/utils/withSentry"
import { resolver } from "blitz"

const logout = resolver.pipe(resolver.authorize(), async (_, ctx) => {
  await ctx.session.$revoke()

  return {}
})

export default withSentry(logout, "logout")

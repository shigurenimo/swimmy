import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { LoginService } from "application"
import { withSentry } from "interface/utils/withSentry"
import { zLoginMutation } from "interface/validations/loginMutation"

const login = resolver.pipe(
  resolver.zod(zLoginMutation),
  async (props, ctx) => {
    const service = container.resolve(LoginService)

    const user = await service.execute({
      idToken: props.idToken,
    })

    if (user instanceof Error) {
      throw user
    }

    await ctx.session.$create({
      userId: user.id.value,
      role: "USER",
    })

    return {}
  }
)

export default withSentry(login, "login")

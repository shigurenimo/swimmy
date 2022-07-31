import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { LoginService } from "app/application"
import { Token } from "app/domain"
import { withSentry } from "app/interface/utils/withSentry"
import { zLoginMutation } from "app/interface/validations/loginMutation"

const login = resolver.pipe(
  resolver.zod(zLoginMutation),
  (props) => {
    return {
      idToken: new Token(props.idToken),
    }
  },
  async (props, ctx) => {
    const loginService = container.resolve(LoginService)

    const user = await loginService.execute({
      idToken: props.idToken,
    })

    if (user instanceof Error) {
      throw user
    }

    await ctx.session.$create({ userId: user.id.value, role: "USER" })

    return {}
  }
)

export default withSentry(login, "login")

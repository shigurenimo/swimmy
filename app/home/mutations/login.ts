import { withSentry } from "app/core/utils/withSentry"
import { zLoginMutation } from "app/home/validations/loginMutation"
import { resolver } from "blitz"
import { LoginService } from "integrations/application"
import { Token } from "integrations/domain"
import { container } from "tsyringe"

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

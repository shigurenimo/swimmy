import { container } from "tsyringe"
import { MutationResolvers } from "interface/__generated__/node"
import { LoginService } from "service"

export const login: MutationResolvers["login"] = async (_, args) => {
  const service = container.resolve(LoginService)

  const user = await service.execute({
    idToken: args.input.token,
  })

  if (user instanceof Error) {
    throw user
  }

  // Session is managed client-side via Firebase Auth
  // The ID token is verified server-side on each request

  return null
}

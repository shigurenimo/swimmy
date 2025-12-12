import { MutationResolvers } from "interface/__generated__/node"

export const logout: MutationResolvers["logout"] = async () => {
  // Logout is handled client-side via Firebase Auth's signOut
  // No server-side session to revoke

  return null
}

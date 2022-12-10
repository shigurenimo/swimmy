import { AppPost } from "infrastructure/types"

export type AppReference = {
  type: "post"
  post: AppPost
}

import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "interface/__generated__/node"
import { addReaction } from "interface/resolvers/addReaction"
import { createPost } from "interface/resolvers/createPost"
import { feed } from "interface/resolvers/feed"
import { login } from "interface/resolvers/login"
import { logout } from "interface/resolvers/logout"
import { posts } from "interface/resolvers/posts"
import { responses } from "interface/resolvers/responses"
import { thread } from "interface/resolvers/thread"
import { threads } from "interface/resolvers/threads"

const Query: QueryResolvers = {
  feed: feed,
  posts: posts,
  responses: responses,
  thread: thread,
  threads: threads,
}

const Mutation: MutationResolvers = {
  addReaction: addReaction,
  createPost: createPost,
  login: login,
  logout: logout,
}

export const resolvers: Resolvers = {
  Query,
  Mutation,
}

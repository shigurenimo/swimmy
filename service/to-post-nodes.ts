import type { posts, reactions } from "@/db/schema"
import type { PostNode } from "@/interface/api/post-node-schema"
import type { ReactionNode } from "@/interface/api/reaction-node-schema"

type Props = {
  posts: Pick<
    typeof posts.$inferSelect,
    "id" | "createdAt" | "text" | "fileIds" | "isDeleted" | "likesCount" | "repliesCount"
  >[]
  reactions: (Pick<typeof reactions.$inferSelect, "id" | "postId" | "text" | "createdAt"> & {
    secretCount: number
    usersCount: number
  })[]
}

export function toPostNodes(props: Props): PostNode[] {
  const reactionsByPostId = new Map<string, ReactionNode[]>()

  for (const reaction of props.reactions.toSorted(
    (first, second) => first.createdAt.getTime() - second.createdAt.getTime(),
  )) {
    if (reaction.secretCount + reaction.usersCount <= 0) {
      continue
    }

    const postReactions = reactionsByPostId.get(reaction.postId) ?? []

    postReactions.push({
      id: reaction.id,
      text: reaction.text,
      count: reaction.usersCount,
      secretCount: reaction.secretCount,
      isConnected: false,
    })
    reactionsByPostId.set(reaction.postId, postReactions)
  }

  return props.posts.map((post) => ({
    id: post.id,
    createdAt: Math.floor(post.createdAt.getTime() / 1000),
    text: post.text,
    fileIds: post.fileIds ?? [],
    likesCount: post.likesCount,
    repliesCount: post.repliesCount,
    isDeleted: post.isDeleted ?? false,
    reactions: reactionsByPostId.get(post.id) ?? [],
  }))
}

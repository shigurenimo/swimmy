import type { PostNode } from "@/interface/api/post-node-schema"
import type { PostsPage } from "@/interface/api/posts-page-schema"

type Props = {
  totalCount: number
  take: number
  nodes: PostNode[]
}

/**
 * サービスの結果をページング付きレスポンスに変換する
 */
export function toPostsPage(props: Props): PostsPage {
  const hasNextPage = props.nodes.length > props.take
  const nodes = hasNextPage ? props.nodes.slice(0, props.take) : props.nodes
  const lastNode = nodes[nodes.length - 1] ?? null

  return {
    totalCount: props.totalCount,
    pageInfo: {
      endCursor: hasNextPage ? (lastNode?.id ?? null) : null,
      hasNextPage,
    },
    nodes,
  }
}

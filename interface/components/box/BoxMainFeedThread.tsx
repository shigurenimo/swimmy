import { useSession } from "@blitzjs/auth"
import { List, ListItem } from "@mui/material"
import { FC } from "react"
import { useThreadsQuery } from "interface/__generated__/react"
import { BoxCardPost } from "interface/components/box/BoxCardPost"
import { BoxMain } from "interface/components/box/BoxMain"
import { ButtonFetchMore } from "interface/components/button/ButtonFetchMore"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedThread: FC<Props> = (props) => {
  const session = useSession()

  const threadsQuery = useThreadsQuery({})

  const onFetchNextPage = () => {
    threadsQuery.fetchMore({
      variables: {
        after: threadsQuery.data?.threads.pageInfo.endCursor,
      },
    })
  }

  return (
    <BoxMain>
      <List disablePadding>
        {threadsQuery.data?.threads.edges.map((edge) => (
          <ListItem key={edge.cursor}>
            <BoxCardPost
              id={edge.node.id}
              text={edge.node.text ?? null}
              createdAt={edge.node.createdAt}
              fileIds={edge.node.fileIds}
              repliesCount={edge.node.repliesCount}
              reactions={edge.node.reactions}
              isLoggedIn={session.userId !== null}
              isActive={edge.node.id === props.threadId}
              onOpenThread={() => {
                props.onChangeThreadId(edge.node.id)
              }}
            />
          </ListItem>
        ))}
        <ListItem>
          <ButtonFetchMore
            isFetching={threadsQuery.loading}
            hasNextPage={threadsQuery.data?.threads.pageInfo.hasNextPage}
            isFetchingNextPage={threadsQuery.loading}
            onClick={onFetchNextPage}
          />
        </ListItem>
      </List>
    </BoxMain>
  )
}

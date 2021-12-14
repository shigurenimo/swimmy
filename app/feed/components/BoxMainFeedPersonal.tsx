import { List, ListItem, Stack } from "@mui/material"
import { BoxCardPost } from "app/core/components/box/BoxCardPost"
import readFeedPersonal from "app/feed/queries/readFeedPersonal"
import { useQuery, useSession } from "blitz"
import React, { FunctionComponent } from "react"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedPersonal: FunctionComponent<Props> = (props) => {
  const session = useSession()

  const [query, { refetch }] = useQuery(
    readFeedPersonal,
    { skip: 0 }
    // { refetchInterval: 10000 }
  )

  return (
    <Stack flex={1} sx={{ pb: 2 }}>
      <List>
        {query.posts.map((post) => (
          <ListItem key={post.id}>
            <BoxCardPost
              {...post}
              isLoggedIn={session.userId !== null}
              onOpenThread={() => {
                props.onChangeThreadId(post.id)
              }}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}

import { List, ListItem, Stack } from "@mui/material"
import { BoxCardPost } from "app/core/components/box/BoxCardPost"
import readFeedThread from "app/threads/queries/readFeedThread"
import { useInfiniteQuery, useSession } from "blitz"
import React, { Fragment, FunctionComponent } from "react"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedThread: FunctionComponent<Props> = (props) => {
  const session = useSession()

  const [pages, { refetch }] = useInfiniteQuery(
    readFeedThread,
    (page = { skip: 0 }) => {
      return { skip: page.skip }
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.nextPage
      },
    }
    // { refetchInterval: 10000 }
  )

  return (
    <Stack flex={1} sx={{ pb: 2 }}>
      <List>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.items.map((post) => (
              <ListItem key={post.id}>
                <BoxCardPost
                  {...post}
                  isLoggedIn={session.userId !== null}
                  isActive={post.id === props.threadId}
                  onOpenThread={() => {
                    props.onChangeThreadId(post.id)
                  }}
                />
              </ListItem>
            ))}
          </Fragment>
        ))}
      </List>
    </Stack>
  )
}

import { List, ListItem, Stack } from "@mui/material"
import { BoxCardPost } from "app/core/components/box/BoxCardPost"
import { ButtonFetchMore } from "app/core/components/button/ButtonFetchMore"
import type { zReadFeedThread } from "app/threads/queries/readFeedThread"
import readFeedThread from "app/threads/queries/readFeedThread"
import { useInfiniteQuery, useSession } from "blitz"
import React, { Fragment, FunctionComponent } from "react"
import { z } from "zod"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedThread: FunctionComponent<Props> = (props) => {
  const session = useSession()

  const [
    pages,
    { hasNextPage, isFetchingNextPage, fetchNextPage, isFetching },
  ] = useInfiniteQuery(
    readFeedThread,
    (page = { skip: 0 }): z.infer<typeof zReadFeedThread> => {
      return { skip: page.skip }
    },
    {
      refetchInterval: 8000,
      getNextPageParam(lastPage) {
        return lastPage.nextPage
      },
    }
  )

  return (
    <Stack
      component={"main"}
      flex={1}
      sx={{
        pb: 2,
        width: "100%",
        maxWidth(theme) {
          return theme.spacing(80)
        },
        minWidth(theme) {
          return {
            md: theme.spacing(40),
            lg: theme.spacing(60),
          }
        },
        margin: "0 auto",
      }}
    >
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
        <ListItem>
          <ButtonFetchMore
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onClick={fetchNextPage}
          />
        </ListItem>
      </List>
    </Stack>
  )
}

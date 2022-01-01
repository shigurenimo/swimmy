import { List, ListItem } from "@mui/material"
import { BoxCardPost } from "app/core/components/box/BoxCardPost"
import { BoxMain } from "app/core/components/box/BoxMain"
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
    <BoxMain>
      <List disablePadding>
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
    </BoxMain>
  )
}

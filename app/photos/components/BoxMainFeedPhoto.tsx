import { List, ListItem, Stack } from "@mui/material"
import { BoxCardPhoto } from "app/core/components/box/BoxCardPhoto"
import readFeedPhotos from "app/photos/queries/readFeedPhotos"
import { useInfiniteQuery } from "blitz"
import React, { Fragment, FunctionComponent } from "react"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedPhoto: FunctionComponent<Props> = (props) => {
  const [pages, { refetch }] = useInfiniteQuery(
    readFeedPhotos,
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
                <BoxCardPhoto
                  {...post}
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

import { useSession } from "@blitzjs/auth"
import { useInfiniteQuery } from "@blitzjs/rpc"
import { List, ListItem } from "@mui/material"
import { FC, Fragment } from "react"
import { z } from "zod"
import type { zReadFeedPhotos } from "integrations/queries/readFeedPhotos"
import readFeedPhotos from "integrations/queries/readFeedPhotos"
import { BoxCardPhoto } from "interface/components/box/BoxCardPhoto"
import { BoxMain } from "interface/components/box/BoxMain"
import { ButtonFetchMore } from "interface/components/button/ButtonFetchMore"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedPhoto: FC<Props> = (props) => {
  const session = useSession()

  const [
    pages,
    { hasNextPage, isFetchingNextPage, fetchNextPage, isFetching },
  ] = useInfiniteQuery(
    readFeedPhotos,
    (page = { skip: 0 }): z.infer<typeof zReadFeedPhotos> => {
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
                <BoxCardPhoto
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

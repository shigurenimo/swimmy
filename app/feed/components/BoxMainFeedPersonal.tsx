import { List, ListItem } from "@mui/material"
import { captureException } from "@sentry/react"
import { BoxCardPost } from "app/core/components/box/BoxCardPost"
import { BoxMain } from "app/core/components/box/BoxMain"
import readFeedPersonal, {
  zReadFeedPersonal,
} from "app/feed/queries/readFeedPersonal"
import createUniquePost from "app/home/mutations/createUniquePost"
import { BoxFormPost } from "app/threads/components/BoxFormPost"
import { FormNewPost } from "app/threads/types/formNewPost"
import { useInfiniteQuery, useMutation, useSession } from "blitz"
import { AppPost } from "integrations/types"
import { useSnackbar } from "notistack"
import React, { Fragment, FunctionComponent } from "react"
import { z } from "zod"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedPersonal: FunctionComponent<Props> = (props) => {
  const session = useSession()

  const [
    pages,
    {
      refetch,
      setQueryData,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      isFetching,
    },
  ] = useInfiniteQuery(
    readFeedPersonal,
    (page = { skip: 0 }): z.infer<typeof zReadFeedPersonal> => {
      return { skip: page.skip }
    },
    {
      refetchInterval: 4000,
      getNextPageParam(lastPage) {
        return lastPage.nextPage
      },
    }
  )

  const { enqueueSnackbar } = useSnackbar()

  const [createPostMutation, { isLoading }] = useMutation(createUniquePost)

  const onCreatePost = async (value: FormNewPost) => {
    try {
      await createPostMutation({
        text: value.text,
        fileIds: value.fileIds,
        replyId: null,
      })
      refetch()
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  const onUpdatePosts = (postUpdated: AppPost) => {
    for (const page of pages) {
      for (const item of page.items) {
        if (item.id === postUpdated.id) {
          item.reactions = postUpdated.reactions
        }
      }
      setQueryData(page)
    }
  }

  return (
    <BoxMain>
      <BoxFormPost isLoading={isLoading} onCreatePost={onCreatePost} />
      <List>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.items.map((post) => (
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
          </Fragment>
        ))}
      </List>
    </BoxMain>
  )
}

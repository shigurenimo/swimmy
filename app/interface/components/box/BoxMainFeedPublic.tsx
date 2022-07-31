import { useSession } from "@blitzjs/auth"
import { useInfiniteQuery, useMutation } from "@blitzjs/rpc"
import { List, ListItem } from "@mui/material"
import { captureException } from "@sentry/react"
import { useSnackbar } from "notistack"
import { FC, Fragment } from "react"
import { z } from "zod"
import { BoxCardPost } from "app/interface/components/box/BoxCardPost"
import { BoxFormPost } from "app/interface/components/box/BoxFormPost"
import { BoxMain } from "app/interface/components/box/BoxMain"
import { ButtonFetchMore } from "app/interface/components/button/ButtonFetchMore"
import createPublicPost from "app/interface/mutations/createPublicPost"
import readFeedPublic, {
  zReadFeedPublic,
} from "app/interface/queries/readFeedPublic"
import { FormNewPost } from "app/interface/types/formNewPost"
import { AppPost } from "integrations/types"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedPublic: FC<Props> = (props) => {
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
    readFeedPublic,
    (page = { skip: 0 }): z.infer<typeof zReadFeedPublic> => {
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

  const [createPostMutation, { isLoading }] = useMutation(createPublicPost)

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
                  isActive={post.id === props.threadId}
                  onUpdate={onUpdatePosts}
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

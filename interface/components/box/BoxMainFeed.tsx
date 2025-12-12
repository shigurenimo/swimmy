import { List, ListItem } from "@mui/material"
import { captureException } from "@sentry/react"
import { useSnackbar } from "notistack"
import { FC } from "react"
import { usePostsQuery } from "interface/__generated__/react"
import { BoxCardPost } from "interface/components/box/BoxCardPost"
import { BoxFormPost } from "interface/components/box/BoxFormPost"
import { BoxMain } from "interface/components/box/BoxMain"
import { ButtonFetchMore } from "interface/components/button/ButtonFetchMore"
import { useCreateFeedPostMutation } from "interface/hooks/useCreateFeedPostMutation"
import { FormNewPost } from "interface/types/formNewPost"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeed: FC<Props> = (props) => {

  const query = usePostsQuery({
    variables: { after: null },
  })

  const { enqueueSnackbar } = useSnackbar()

  const [createPostMutation, mutationResult] = useCreateFeedPostMutation()

  const onCreatePost = async (value: FormNewPost) => {
    try {
      await createPostMutation({
        variables: {
          input: {
            text: value.text,
            fileIds: value.fileIds,
            threadId: null,
          },
        },
      })
    } catch (error) {
      captureException(error)
      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  const onFetchMode = async () => {
    await query.fetchMore({
      variables: { after: query.data?.posts.pageInfo.endCursor },
    })
  }

  return (
    <BoxMain>
      <BoxFormPost
        isLoading={mutationResult.loading}
        onCreatePost={onCreatePost}
      />
      <List>
        {query.data?.posts.edges.map((edge, index) => (
          <ListItem key={edge.cursor}>
            <BoxCardPost
              id={edge.node.id}
              text={edge.node.text ?? null}
              createdAt={edge.node.createdAt}
              fileIds={edge.node.fileIds}
              repliesCount={edge.node.repliesCount}
              reactions={edge.node.reactions}
              isActive={edge.node.id === props.threadId}
              onOpenThread={() => {
                props.onChangeThreadId(edge.node.id)
              }}
            />
          </ListItem>
        ))}
        <ListItem>
          <ButtonFetchMore
            isFetching={query.loading}
            hasNextPage={query.data?.posts.pageInfo.hasNextPage}
            isFetchingNextPage={query.loading}
            onClick={onFetchMode}
          />
        </ListItem>
      </List>
    </BoxMain>
  )
}

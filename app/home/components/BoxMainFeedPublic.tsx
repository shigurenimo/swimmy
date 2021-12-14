import { List, ListItem, Stack } from "@mui/material"
import { captureException } from "@sentry/react"
import { BoxCardPost } from "app/core/components/box/BoxCardPost"
import createPost from "app/home/mutations/createPost"
import readFeedPublic from "app/home/queries/readFeedPublic"
import { BoxFormPost } from "app/threads/components/BoxFormPost"
import { FormNewPost } from "app/threads/types/formNewPost"
import { useMutation, useQuery, useSession } from "blitz"
import { AppPost } from "integrations/interface/types/appPost"
import { useSnackbar } from "notistack"
import React, { FunctionComponent } from "react"

type Props = {
  threadId: string | null
  onChangeThreadId(threadId: string): void
}

export const BoxMainFeedPublic: FunctionComponent<Props> = (props) => {
  const session = useSession()

  const [postsQuery, { refetch, setQueryData }] = useQuery(
    readFeedPublic,
    { skip: 0 },
    { refetchInterval: 4000 }
  )

  const { enqueueSnackbar } = useSnackbar()

  const [createPostMutation, { isLoading }] = useMutation(createPost)

  const onCreatePost = async (value: FormNewPost) => {
    try {
      await createPostMutation({
        text: value.text,
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
    for (const post of postsQuery.posts) {
      if (post.id === postUpdated.id) {
        post.reactions = postUpdated.reactions
      }
    }
    setQueryData({ posts: postsQuery.posts })
  }

  return (
    <Stack flex={1} sx={{ py: 2 }}>
      <BoxFormPost isLoading={isLoading} onCreatePost={onCreatePost} />
      <List>
        {postsQuery.posts.map((post) => (
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
      </List>
    </Stack>
  )
}

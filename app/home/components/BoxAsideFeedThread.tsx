import { Box, Divider, List, ListItem } from "@mui/material"
import { captureException } from "@sentry/react"
import { BoxAside } from "app/core/components/box/BoxAside"
import { BoxCardPost } from "app/core/components/box/BoxCardPost"
import { BoxCardResponse } from "app/core/components/box/BoxCardResponse"
import { BoxAsideFeedThreadFallback } from "app/home/components/BoxAsideFeedThreadFallback"
import createPost from "app/home/mutations/createPost"
import { BoxFormResponse } from "app/threads/components/BoxFormResponse"
import readPost from "app/threads/queries/readPost"
import readThreadResponses from "app/threads/queries/readThreadResponses"
import { FormNewPost } from "app/threads/types/formNewPost"
import { useMutation, useQuery, useSession } from "blitz"
import { AppPost } from "integrations/interface/types/appPost"
import React, { Fragment, FunctionComponent } from "react"

type Props = {
  threadId: string
  onClose(): void
}

export const BoxAsideFeedThread: FunctionComponent<Props> = (props) => {
  const session = useSession()

  const [postQuery, { isFetching, setQueryData }] = useQuery(readPost, {
    postId: props.threadId,
  })

  const [responsesQuery, { refetch }] = useQuery(readThreadResponses, {
    postId: props.threadId,
  })

  const [createPostMutation, { isLoading }] = useMutation(createPost)

  const onCreateResponse = async (value: FormNewPost) => {
    try {
      await createPostMutation({
        text: value.text,
        replyId: props.threadId,
      })
      refetch()
    } catch (error) {
      if (error instanceof Error) {
        captureException(error)
      }
    }
  }

  const onUpdatePosts = (postUpdated: AppPost) => {
    postQuery.post = postUpdated
    setQueryData({ post: postQuery.post }, { refetch: false })
  }

  if (isFetching) {
    return <BoxAsideFeedThreadFallback />
  }

  const length = responsesQuery.posts.length

  return (
    <BoxAside title={"スレッド"} onClose={props.onClose}>
      <List disablePadding>
        <ListItem sx={{ pt: 2, pb: length === 0 ? 2 : 1 }}>
          <BoxCardPost
            {...postQuery.post}
            isLoggedIn={session.userId !== null}
            onUpdate={onUpdatePosts}
          />
        </ListItem>
        {responsesQuery.posts.map((response, index) => (
          <Fragment key={response.id}>
            <ListItem sx={index === 0 ? { pb: 2, pt: 1 } : { py: 2 }}>
              <BoxCardResponse {...response} index={index + 1} />
            </ListItem>
            {index !== length - 1 && (
              <Box sx={{ px: 2 }}>
                <Divider />
              </Box>
            )}
          </Fragment>
        ))}
      </List>
      <BoxFormResponse
        isLoading={isLoading}
        onCreateResponse={onCreateResponse}
      />
    </BoxAside>
  )
}

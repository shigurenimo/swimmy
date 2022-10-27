import { useSession } from "@blitzjs/auth"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Box, Divider, List, ListItem } from "@mui/material"
import { captureException } from "@sentry/react"
import { FC, Fragment } from "react"
import createPublicPost from "integrations/mutations/createPublicPost"
import readPost from "integrations/queries/readPost"
import readThreadResponses from "integrations/queries/readThreadResponses"
import { AppPost } from "integrations/types"
import { BoxAside } from "interface/components/box/BoxAside"
import { BoxAsideFeedThreadFallback } from "interface/components/box/BoxAsideFeedThreadFallback"
import { BoxCardPost } from "interface/components/box/BoxCardPost"
import { BoxCardResponse } from "interface/components/box/BoxCardResponse"
import { BoxFormResponse } from "interface/components/box/BoxFormResponse"
import { FormNewPost } from "interface/types/formNewPost"

type Props = {
  threadId: string
  onClose(): void
}

export const BoxAsideFeedThread: FC<Props> = (props) => {
  const session = useSession()

  const [postQuery, { isFetching, setQueryData }] = useQuery(readPost, {
    postId: props.threadId,
  })

  const [responsesQuery, { refetch }] = useQuery(readThreadResponses, {
    postId: props.threadId,
  })

  const [createPostMutation, { isLoading }] = useMutation(createPublicPost)

  const onCreateResponse = async (value: FormNewPost) => {
    try {
      await createPostMutation({
        text: value.text,
        replyId: props.threadId,
        fileIds: [],
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

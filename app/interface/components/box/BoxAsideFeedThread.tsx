import { useSession } from "@blitzjs/auth";
import { useMutation, useQuery } from "@blitzjs/rpc";
import { Box, Divider, List, ListItem } from "@mui/material"
import { captureException } from "@sentry/react"
import { BoxAside } from "app/interface/components/box/BoxAside"
import { BoxCardPost } from "app/interface/components/box/BoxCardPost"
import { BoxCardResponse } from "app/interface/components/box/BoxCardResponse"
import { BoxAsideFeedThreadFallback } from "app/interface/components/box/BoxAsideFeedThreadFallback"
import createPublicPost from "app/interface/mutations/createPublicPost"
import { BoxFormResponse } from "app/interface/components/box/BoxFormResponse"
import readPost from "app/interface/queries/readPost"
import readThreadResponses from "app/interface/queries/readThreadResponses"
import { FormNewPost } from "app/interface/types/formNewPost"
import { AppPost } from "integrations/types"
import { FC, Fragment } from "react"

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

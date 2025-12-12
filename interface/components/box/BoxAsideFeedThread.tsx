import { useSession } from "interface/hooks/useSession"
import { Box, Divider, List, ListItem } from "@mui/material"
import { captureException } from "@sentry/react"
import { FC, Fragment } from "react"
import {
  useResponsesQuery,
  useThreadQuery,
} from "interface/__generated__/react"
import { BoxAside } from "interface/components/box/BoxAside"
import { BoxAsideFeedThreadFallback } from "interface/components/box/BoxAsideFeedThreadFallback"
import { BoxCardPost } from "interface/components/box/BoxCardPost"
import { BoxCardResponse } from "interface/components/box/BoxCardResponse"
import { BoxFormResponse } from "interface/components/box/BoxFormResponse"
import { useCreateResponseMutation } from "interface/hooks/useCreateResponseMutation"
import { FormNewPost } from "interface/types/formNewPost"

type Props = {
  threadId: string
  onClose(): void
}

export const BoxAsideFeedThread: FC<Props> = (props) => {
  const session = useSession()

  const threadQuery = useThreadQuery({
    variables: { threadId: props.threadId },
  })

  const responsesQuery = useResponsesQuery({
    variables: { threadId: props.threadId },
  })

  const [createPostMutation] = useCreateResponseMutation({
    threadId: props.threadId,
  })

  const onCreateResponse = async (value: FormNewPost) => {
    try {
      await createPostMutation({
        variables: {
          input: {
            text: value.text,
            threadId: props.threadId,
            fileIds: [],
          },
        },
      })
      await threadQuery.refetch()
    } catch (error) {
      if (error instanceof Error) {
        captureException(error)
      }
    }
  }

  if (threadQuery.loading) {
    return <BoxAsideFeedThreadFallback />
  }

  const length = responsesQuery.data?.responses.edges.length ?? 0

  return (
    <BoxAside title={"スレッド"} onClose={props.onClose}>
      <List disablePadding>
        <ListItem sx={{ pt: 2, pb: length === 0 ? 2 : 1 }}>
          {threadQuery.data && (
            <BoxCardPost
              {...threadQuery.data.thread}
              text={threadQuery.data.thread.text ?? null}
              isLoggedIn={session.userId !== null}
            />
          )}
        </ListItem>
        {responsesQuery.data?.responses.edges.map((edge, index) => (
          <Fragment key={edge.cursor}>
            <ListItem sx={index === 0 ? { pb: 2, pt: 1 } : { py: 2 }}>
              <BoxCardResponse
                createdAt={edge.node.createdAt}
                text={edge.node.text ?? null}
                index={index + 1}
              />
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
        isLoading={responsesQuery.loading}
        onCreateResponse={onCreateResponse}
      />
    </BoxAside>
  )
}

import { Grid, Stack, Typography } from "@mui/material"
import { captureException } from "@sentry/react"
import { BoxCardPostFrame } from "app/core/components/box/BoxCardPostFrame"
import { BoxFormReaction } from "app/core/components/box/BoxFormReaction"
import { BoxImage } from "app/core/components/box/BoxImage"
import { ChipReaction } from "app/core/components/chip/ChipReaction"
import { ChipReactionNew } from "app/core/components/chip/ChipReactionNew"
import { ChipSecretReaction } from "app/core/components/chip/ChipSecretReaction"
import { useDateText } from "app/core/hooks/useDateText"
import createReaction from "app/home/mutations/createReaction"
import { useMutation } from "blitz"
import { AppPost, AppThread } from "integrations/types"
import { useSnackbar } from "notistack"
import React, { FunctionComponent, useState } from "react"

type AppAnyPost = AppPost | AppThread

type Props = AppAnyPost & {
  onOpenThread?(): void
  onUpdate?(post: AppPost): void
  isActive?: boolean
  isLoggedIn: boolean
}

export const BoxCardPost: FunctionComponent<Props> = (props) => {
  const dateText = useDateText(props.createdAt)

  const { enqueueSnackbar } = useSnackbar()

  const [isReaction, setReaction] = useState(false)

  const [createReactionMutation, { isLoading }] = useMutation(createReaction)

  const onUpdateReaction = async (text: string) => {
    try {
      const result = await createReactionMutation({ text, postId: props.id })
      props.onUpdate?.(result.post)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        enqueueSnackbar(error.message)
      }
    }
  }

  const onInitReaction = () => {
    setReaction(true)
  }

  const onCancelReaction = () => {
    setReaction(false)
  }

  return (
    <BoxCardPostFrame isActive={props.isActive} onClick={props.onOpenThread}>
      <Stack spacing={1}>
        <Stack spacing={0.5}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontSize={12} sx={{ opacity: 0.6, letterSpacing: 0.4 }}>
              {dateText}
            </Typography>
            {0 < props.repliesCount && (
              <Typography
                fontSize={12}
                sx={{
                  fontWeight: (theme) => theme.typography.fontWeightBold,
                  color: (theme) => theme.palette.primary.main,
                }}
              >
                {`リプライ ${props.repliesCount}`}
              </Typography>
            )}
          </Stack>
          <Typography fontWeight={"bold"}>{props.text}</Typography>
          {props.fileIds.length > 0 && (
            <Stack>
              {props.fileIds.map((fileId) => (
                <BoxImage key={fileId} fileId={fileId} />
              ))}
            </Stack>
          )}
          <Grid container gap={1}>
            {props.reactions.map((reaction) => (
              <Grid item key={reaction.id}>
                {props.isLoggedIn ? (
                  <ChipReaction
                    text={reaction.text}
                    count={reaction.count}
                    secretCount={reaction.secretCount}
                    isActive={reaction.isConnected}
                    onClick={() => {
                      onUpdateReaction(reaction.text)
                    }}
                  />
                ) : (
                  <ChipSecretReaction
                    text={reaction.text}
                    count={reaction.count}
                    secretCount={reaction.secretCount}
                    onClick={() => {
                      onUpdateReaction(reaction.text)
                    }}
                  />
                )}
              </Grid>
            ))}
            <Grid item>
              {!isReaction && (
                <ChipReactionNew label={"+"} onClick={onInitReaction} />
              )}
            </Grid>
          </Grid>
        </Stack>
        {isReaction && (
          <BoxFormReaction
            postId={props.id}
            onClose={onCancelReaction}
            onUpdatePost={props.onUpdate}
          />
        )}
      </Stack>
    </BoxCardPostFrame>
  )
}

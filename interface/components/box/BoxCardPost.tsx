import { Grid, Stack, Typography } from "@mui/material"
import { captureException } from "@sentry/react"
import { useSnackbar } from "notistack"
import { FC, useState } from "react"
import {
  ReactionNode,
  useAddReactionMutation,
} from "interface/__generated__/react"
import { BoxCardPostFrame } from "interface/components/box/BoxCardPostFrame"
import { BoxFormReaction } from "interface/components/box/BoxFormReaction"
import { BoxImage } from "interface/components/box/BoxImage"
import { ChipReaction } from "interface/components/chip/ChipReaction"
import { ChipReactionNew } from "interface/components/chip/ChipReactionNew"
import { ChipSecretReaction } from "interface/components/chip/ChipSecretReaction"
import { useDateText } from "interface/hooks/useDateText"

type Props = {
  id: string
  text: string | null
  createdAt: number
  fileIds: string[]
  repliesCount: number
  reactions: ReactionNode[]
  onOpenThread?(): void
  isActive?: boolean
  isLoggedIn: boolean
}

export const BoxCardPost: FC<Props> = (props) => {
  const dateText = useDateText(new Date(props.createdAt * 1000))

  const { enqueueSnackbar } = useSnackbar()

  const [isReaction, setReaction] = useState(false)

  const [addReactionMutation] = useAddReactionMutation({})

  const onUpdateReaction = async (text: string) => {
    try {
      await addReactionMutation({
        variables: {
          input: {
            text,
            postId: props.id,
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
              <Grid key={reaction.id}>
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
            <Grid>
              {!isReaction && (
                <ChipReactionNew label={"+"} onClick={onInitReaction} />
              )}
            </Grid>
          </Grid>
        </Stack>
        {isReaction && (
          <BoxFormReaction postId={props.id} onClose={onCancelReaction} />
        )}
      </Stack>
    </BoxCardPostFrame>
  )
}

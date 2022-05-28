import { Grid, Stack, Typography } from "@mui/material"
import { captureException } from "@sentry/react"
import { BoxCardPostFrame } from "app/core/components/box/BoxCardPostFrame"
import { BoxFormReaction } from "app/core/components/box/BoxFormReaction"
import { BoxImage } from "app/core/components/box/BoxImage"
import { ChipReaction } from "app/core/components/chip/ChipReaction"
import { ChipReactionNew } from "app/core/components/chip/ChipReactionNew"
import { useDateText } from "app/core/hooks/useDateText"
import createReaction from "app/home/mutations/createReaction"
import { useMutation } from "blitz"
import { AppPhoto, AppPost } from "integrations/types"
import { useSnackbar } from "notistack"
import { FC, useState } from "react"

type Props = AppPhoto & {
  onOpenThread?(): void
  onUpdate?(post: AppPost): void
  isActive?: boolean
  isLoggedIn: boolean
}

export const BoxCardPhoto: FC<Props> = (props) => {
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

  const [fileId] = props.fileIds

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
          {fileId && <BoxImage fileId={fileId} />}
          <Grid container gap={1}>
            {props.reactions.map((reaction) => (
              <Grid item key={reaction.id}>
                <ChipReaction
                  text={reaction.text}
                  count={reaction.count}
                  secretCount={reaction.secretCount}
                  isActive={reaction.isConnected}
                  onClick={() => {
                    onUpdateReaction(reaction.text)
                  }}
                />
              </Grid>
            ))}
            {props.isLoggedIn && (
              <Grid item>
                {!isReaction && (
                  <ChipReactionNew label={"+"} onClick={onInitReaction} />
                )}
              </Grid>
            )}
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

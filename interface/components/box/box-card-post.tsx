"use client"

import Link from "next/link"
import { type FC, useState } from "react"
import type { PostNode } from "@/interface/api/post-node-schema"
import { Card, CardContent } from "@/components/ui/card"
import { BoxFormReaction } from "@/interface/components/box/box-form-reaction"
import { BoxImage } from "@/interface/components/box/box-image"
import { ChipReaction } from "@/interface/components/chip/chip-reaction"
import { ChipReactionNew } from "@/interface/components/chip/chip-reaction-new"
import { useCreateReactionMutation } from "@/interface/hooks/use-create-reaction-mutation"
import { getDateText } from "@/interface/utils/get-date-text"

type Props = Pick<
  PostNode,
  "id" | "text" | "createdAt" | "fileIds" | "repliesCount" | "reactions"
> & {
  href?: string
  isActive?: boolean
}

export const BoxCardPost: FC<Props> = (props) => {
  const dateText = getDateText(new Date(props.createdAt * 1000))

  const [isReaction, setReaction] = useState(false)

  const createReactionMutation = useCreateReactionMutation()

  const onUpdateReaction = async (text: string) => {
    try {
      await createReactionMutation.mutateAsync({
        postId: props.id,
        text: text,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onInitReaction = () => {
    setReaction(true)
  }

  const onCancelReaction = () => {
    setReaction(false)
  }

  const summary = (
    <>
      <div className="flex flex-row justify-between">
        <time
          dateTime={new Date(props.createdAt * 1000).toISOString()}
          suppressHydrationWarning
          className="text-xs tracking-wide text-muted-foreground"
        >
          {dateText}
        </time>
        {0 < props.repliesCount && (
          <span className="font-bold text-primary text-xs">{`リプライ ${props.repliesCount}`}</span>
        )}
      </div>
      <p className="break-words font-medium">{props.text}</p>
      {props.fileIds.length > 0 && (
        <div className="flex flex-col gap-4">
          {props.fileIds.map((fileId) => (
            <BoxImage key={fileId} fileId={fileId} />
          ))}
        </div>
      )}
    </>
  )

  return (
    <div className="relative">
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            {props.href ? (
              <Link
                href={props.href}
                scroll={false}
                aria-current={props.isActive ? "true" : undefined}
                className="flex min-w-0 flex-col gap-4 text-left after:absolute after:inset-0"
              >
                {summary}
              </Link>
            ) : (
              <div className="flex flex-col gap-4">{summary}</div>
            )}
            <div className="flex flex-wrap gap-4">
              {props.reactions.map((reaction) => (
                <div key={reaction.id} className="relative z-2">
                  <ChipReaction
                    text={reaction.text}
                    count={reaction.count}
                    secretCount={reaction.secretCount}
                    isActive={reaction.isConnected}
                    onClick={() => {
                      onUpdateReaction(reaction.text)
                    }}
                  />
                </div>
              ))}
              <div className="relative z-2">
                {!isReaction && (
                  <ChipReactionNew label="リアクションを追加" onClick={onInitReaction} />
                )}
              </div>
            </div>
            {isReaction && (
              <div className="relative z-2">
                <BoxFormReaction postId={props.id} onClose={onCancelReaction} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

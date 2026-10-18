import { defineHead } from "void"
import { metadataHead, threadMetadata } from "@/app/metadata"

export const head = defineHead((c) => {
  const { board } = c.get("shared")
  return board?.post ? metadataHead(threadMetadata(board.post)) : {}
})

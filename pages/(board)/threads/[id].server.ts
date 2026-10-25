import { defineHead } from "void"
import { metadataHead, threadMetadata } from "@/metadata"

export const head = defineHead((c) => {
  const { board } = c.get("shared")
  return board?.post ? metadataHead(threadMetadata(board.post)) : {}
})

import { appendFile, mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const INBOX_DIR = path.join(process.env.HOME ?? "", ".claude", "inboxes")

type MessagePayload = {
  type: string
  summary?: string
  [key: string]: unknown
}

type MessageEvent = {
  id: string
  type: "agent"
  timestamp: string
  payload: MessagePayload
  senderId: string
  senderName: string
}

async function sendMessage(to: string, payload: MessagePayload): Promise<void> {
  const senderId = process.env.CUSTOM_CHANNEL_INBOX_ID
  const senderName = process.env.CUSTOM_CHANNEL_INBOX_NAME

  if (!senderId) {
    throw new Error(
      "CUSTOM_CHANNEL_INBOX_ID が設定されていません。.claude/settings.json の env に設定してください。",
    )
  }

  await mkdir(INBOX_DIR, { recursive: true })
  const targetPath = path.join(INBOX_DIR, `${to}.jsonl`)
  await writeFile(targetPath, "", { flag: "a" })

  const event: MessageEvent = {
    id: crypto.randomUUID(),
    type: "agent",
    timestamp: new Date().toISOString(),
    payload,
    senderId,
    senderName: senderName ?? senderId,
  }

  await appendFile(targetPath, `${JSON.stringify(event)}\n`)
}

const summary = process.argv[2]

if (!summary) {
  console.error("Usage: bun send-message.ts <summary>")
  process.exit(1)
}

await sendMessage("default", { type: "message", summary })

console.log("Message sent to default")

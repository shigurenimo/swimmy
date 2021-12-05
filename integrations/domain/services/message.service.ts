import { Id } from "integrations/domain/valueObjects"

type Message = {
  user: { id: string }
  isRead: boolean
}

/**
 * メッセージ
 */
export class MessageService {
  hasUnreadMessages(input: { messages: Message[]; userId: Id }) {
    const unreadMessages = input.messages.filter((message) => {
      if (message.user.id === input.userId.value) return false
      return !message.isRead
    })

    return unreadMessages.length > 0
  }
}

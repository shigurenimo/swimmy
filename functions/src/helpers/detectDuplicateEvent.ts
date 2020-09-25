import { EventContext } from 'firebase-functions'

const eventIds: string[] = []

export const detectDuplicateEvent = (context: EventContext) => {
  if (eventIds.includes(context.eventId)) {
    throw new Error('eventId already exists')
  }

  eventIds.push(context.eventId)
}

type Feed = {
  isRead: boolean
}

/**
 * タイムライン
 */
export class ReferenceService {
  hasUnread(input: { references: Feed[] }) {
    const unreadReferences = input.references.filter((referenceEntity) => {
      return !referenceEntity.isRead
    })

    return unreadReferences.length > 0
  }
}

export const getOrderBy = () => {
  switch (location.search.replace('?order=', '')) {
    case 'createdAt':
      return 'createdAt'
    case 'likeCount':
      return 'likeCount'
    case 'replyPostCount':
      return 'replyPostCount'
    default:
      return 'createdAt'
  }
}

import { User } from '../types/user'
import { systemFields } from '../utils/systemFIelds'

type Input = {
  userId: string
  username: string
}

export const createUser = (input: Input): User => {
  return {
    ...systemFields(input.userId),
    description: '',
    displayName: '',
    followeeCount: 0,
    followerCount: 0,
    links: [],
    photoURL: '',
    username: input.username,
    uid: input.userId,
  }
}

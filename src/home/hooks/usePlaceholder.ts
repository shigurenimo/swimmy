import { useMemo } from 'react'

const messages = [
  '新しい書き込み',
  'タップして書き込む',
  'いま何してる？',
  '完全な匿名で書き込む',
  '新しい投稿',
]

export const usePlaceholder = () => {
  return useMemo(() => {
    return messages[Math.floor(Math.random() * messages.length)]
  }, [])
}

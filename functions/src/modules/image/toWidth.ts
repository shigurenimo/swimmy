import { ImageQuery } from './types/imageQuery'

export const toWidth = (query: ImageQuery): number | undefined => {
  const w = query.w

  if (typeof w === 'undefined') return

  try {
    return parseInt(w)
  } catch (e) {
    console.error(e)
    return
  }
}

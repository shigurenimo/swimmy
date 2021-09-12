import { getAnalytics, logEvent } from 'firebase/analytics'
import { FunctionComponent, useEffect } from 'react'

type Props = {
  description?: string
  image?: string
  title?: string | null
}

export const FragmentHead: FunctionComponent<Props> = ({
  description = 'スイミーは完全な匿名の電子掲示板です。ログイン情報やIPアドレスを残さずに利用できます。',
  image = 'https://swimmy.io/icons/icon-512.png',
  title,
}) => {
  const __title = 'スイミー電子掲示板'

  const _title = title ? `${__title} | ${title}` : __title

  useEffect(() => {
    if (!document || !document.head) {
      return
    }

    document.title = _title

    const metaHtmlCollection = Array.from(document.head.children)

    for (const meta of metaHtmlCollection) {
      const name = meta.getAttribute('name')

      if (name && name.includes('description')) {
        meta.setAttribute('content', description)
      }

      if (name && name.includes('twitter:card')) {
        meta.setAttribute('content', 'summary_large_image')
      }

      if (name && name.includes('twitter:site')) {
        meta.setAttribute('content', '@babelrc')
      }

      const property = meta.getAttribute('property')

      if (property && property.includes('og:description')) {
        meta.setAttribute('content', description)
      }

      if (property && property.includes('og:image') && image) {
        meta.setAttribute('content', image)
      }

      if (property && property.includes('og:title')) {
        meta.setAttribute('content', _title)
      }

      if (property && property.includes('og:url')) {
        meta.setAttribute('content', window.location.href)
      }
    }

    if (title === '') return

    logEvent(getAnalytics(), 'page_view', {
      page_title: _title,
      page_location: window.location.pathname,
      page_path: window.location.pathname,
    })
  }, [_title, description, image, title])

  return null
}

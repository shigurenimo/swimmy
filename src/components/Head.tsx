import { FunctionComponent, useEffect } from 'react'

type Props = {
  title?: string
  description?: string
  image?: string
}

const Head: FunctionComponent<Props> = ({
  title = '',
  description = 'スイミー（Swimmy）は完全な匿名の電子掲示板です。IPアドレスやユーザIDを公開せずに完全な匿名で書き込みできます。',
  image = null
}) => {
  const titleDefault = 'スイミー'
  const _title = title ? `${titleDefault} | ${title}` : titleDefault

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
  }, [_title, description, image])

  return null
}

export default Head

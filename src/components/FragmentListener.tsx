import { FunctionComponent, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const FragmentListener: FunctionComponent = () => {
  const history = useHistory()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return
    }
    const dataLayer = window.dataLayer || []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag: any = function() {
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments)
    }

    gtag('js', new Date())

    gtag('config', 'UA-129399085-1')

    history.listen(({ pathname, search }: any) => {
      // eslint-disable-next-line @typescript-eslint/camelcase
      gtag('config', 'UA-129399085-1', { page_path: pathname + search })
    })
  }, [history])

  return null
}

export default FragmentListener

import { FunctionComponent, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

type Props = RouteComponentProps

const RouterListener: FunctionComponent<Props> = ({ history }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return
    }
    const dataLayer = window.dataLayer || []
    const gtag: any = function() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'UA-129399085-1')
    history.listen(({ pathname, search }) => {
      gtag('config', 'UA-129399085-1', { page_path: pathname + search })
    })
  }, [history])

  return null
}

export default withRouter(RouterListener)

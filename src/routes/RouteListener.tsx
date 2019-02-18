import React, { FunctionComponent, useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

type Props = RouteComponentProps

const RouterListener: FunctionComponent<Props> = ({ history }) => {
  const componentDidMount = () => {
    if (process.env.NODE_ENV !== 'development') {
      const dataLayer = window.dataLayer || []
      const gtag: any = function() {
        dataLayer.push(arguments)
      }
      gtag('js', new Date())
      gtag('config', 'UA-129399085-1')
      history.listen(({ pathname, search }) => {
        gtag('config', 'UA-129399085-1', { page_path: pathname + search })
      })
    }
  }

  useEffect(() => {
    componentDidMount()
  }, [])

  return null
}

export default withRouter(RouterListener)

import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface Props extends RouteComponentProps {}

class RouterListener extends React.Component<Props> {
  public render() {
    return null
  }

  public componentDidMount() {
    if (process.env.NODE_ENV === 'development') return
    const { history } = this.props
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

export default withRouter(RouterListener)

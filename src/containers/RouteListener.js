import React from 'react'
import { withRouter } from 'react-router-dom'

class Component extends React.Component {
  render() {
    return null
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'development') return
    const { history } = this.props
    const dataLayer = window.dataLayer || []

    const gtag = function() {
      dataLayer.push(arguments)
    }

    gtag('js', new Date())

    gtag('config', 'UA-129399085-1')

    history.listen(({ pathname, search }) => {
      gtag('config', 'UA-129399085-1', { page_path: pathname + search })
    })
  }
}

export const RouterListener = withRouter(Component)

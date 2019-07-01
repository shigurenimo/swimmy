import React from 'react'
import { render } from 'react-dom'
import App from './app/App'
import './app/shared/helpers/initializeApp'
import './index.css'
import { register } from './serviceWorker'

render(<App />, document.getElementById('root'))

register()

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'auto'
}

if (module.hot) {
  module.hot.accept()
}

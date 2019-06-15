import React from 'react'
import { render } from 'react-dom'
import App from './app/App'
import './app/shared/helpers/initializeApp'
import './index.css'
import * as serviceWorker from './serviceWorker'

render(<App />, document.getElementById('root'))

serviceWorker.unregister()

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'auto'
}

if (module.hot) {
  module.hot.accept()
}

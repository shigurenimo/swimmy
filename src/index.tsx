import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './index.css'
import { register } from './serviceWorker'
import './shared/helpers/initializeApp'

render(<App />, document.getElementById('root'))

register()

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'auto'
}

if (module.hot) {
  module.hot.accept()
}

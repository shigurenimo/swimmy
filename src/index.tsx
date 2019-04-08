import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './helpers/initializeApp'
import './index.css'
import * as serviceWorker from './serviceWorker'

render(<App /> as any, document.getElementById('root'))

serviceWorker.register({})

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'auto'
}

if (module.hot) {
  module.hot.accept()
}

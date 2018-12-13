import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './index.css'
import './libs/initializeApp'
import * as serviceWorker from './serviceWorker'

render(<App /> as any, document.getElementById('root'))

serviceWorker.register({
  onUpdate() {
    window.location.reload()
  }
})

if (module.hot) {
  module.hot.accept()
}

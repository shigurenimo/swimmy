import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './index.css'
import './libs/initializeApp'
import * as serviceWorker from './serviceWorker'

render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate() {
    window.location.reload()
  }
})

if (module.hot) {
  module.hot.accept()
}

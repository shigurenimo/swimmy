import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './firebase/initializeApp'
import './index.css'
import { register } from './serviceWorker'

render(<App />, document.getElementById('root'))

register({
  onUpdate(registration) {
    const waitingServiceWorker = registration.waiting

    if (!waitingServiceWorker) return

    const listener = async (
      event: Event & {
        target: Partial<ServiceWorker> & EventTarget | null
      }
    ) => {
      if (!event.target || event.target.state !== 'activated') return

      window.location.reload()
    }

    waitingServiceWorker.addEventListener('statechange', listener)

    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' })
  }
})

if (module.hot) {
  module.hot.accept()
}

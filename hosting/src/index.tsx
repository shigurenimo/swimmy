import { init } from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './firebase/initializeApp'
import './index.css'
import { register } from './serviceWorkerRegistration'

init({
  dsn:
    'https://082826bd26c8431894383b61c038562e@o471357.ingest.sentry.io/5503302',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
})

render(<App />, document.getElementById('root'))

register({
  onUpdate(registration: ServiceWorkerRegistration) {
    if (!registration.waiting) return

    registration.waiting.addEventListener('statechange', listener)

    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  },
})

const listener = async (
  event: Event & {
    target: (Partial<ServiceWorker> & EventTarget) | null
  }
) => {
  if (!event.target || event.target.state !== 'activated') return

  window.location.reload()
}

if (module.hot) {
  module.hot.accept()
}

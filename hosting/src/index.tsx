import { init } from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import React from 'react'
import { render } from 'react-dom'
import App from './App'
import './core/utitls/initializeApp'
import './index.css'
import reportWebVitals from './reportWebVitals'
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

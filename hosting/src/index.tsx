import { init } from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import React from 'react'
import { render } from 'react-dom'
import { App } from 'src/App'
import 'src/core/utils/initializeApp'
import 'src/index.css'
import reportWebVitals from 'src/reportWebVitals'
import { register } from 'src/serviceWorkerRegistration'

init({
  dsn:
    'https://2b7bdd5af19548a2b0ecd728c69fcc6e@o571144.ingest.sentry.io/5955573',
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

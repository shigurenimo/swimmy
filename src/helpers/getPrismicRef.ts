import { from } from 'rxjs'
import { getPrismicEndpoint } from './getPrismicEndpoint'

export const getPrismicRef = () => {
  const url = getPrismicEndpoint()

  return from(fetch(url))
}

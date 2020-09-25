import { createContext } from 'react'

type Value = {
  apiKey: string
  serviceId: string
}

export const MicroCMSContext = createContext<Value>({
  apiKey: '',
  serviceId: '',
})

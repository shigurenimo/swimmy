import { createContext } from 'react'

export const { Provider: AuthProvicer, Consumer: AuthConsumer } = createContext(
  {
    isLoggingIn: true,
    isLogged: false
  }
)

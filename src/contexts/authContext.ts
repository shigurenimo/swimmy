import { createContext } from 'react'

export const AuthContext = createContext({
  isLogged: false,
  isLoggingIn: true
})

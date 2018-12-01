import { createContext } from 'react'

export const AuthContext = createContext({
  isLoggingIn: true,
  isLogged: false
})

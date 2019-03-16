import { auth } from 'firebase/app'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/authContext'

const AppAuthProvider: FunctionComponent = ({ children }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(true)
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    auth().onAuthStateChanged(res => {
      setIsLogged(Boolean(res))
      setIsLoggingIn(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ isLogged, isLoggingIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AppAuthProvider

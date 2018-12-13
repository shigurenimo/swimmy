import { auth } from 'firebase/app'
import React, { Component } from 'react'
import { AuthContext } from '../contexts/auth'

interface State {
  isLoggingIn: boolean
  isLogged: boolean
}

class AppAuthProvider extends Component {
  public state: State = { isLoggingIn: true, isLogged: false }

  public render() {
    const { children } = this.props
    return (
      <AuthContext.Provider
        value={{
          isLogged: this.state.isLogged,
          isLoggingIn: this.state.isLoggingIn
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  public componentDidMount() {
    auth().onAuthStateChanged(res => {
      this.setState(() => {
        return { isLogged: Boolean(res), isLoggingIn: false }
      })
    })
  }
}

export default AppAuthProvider

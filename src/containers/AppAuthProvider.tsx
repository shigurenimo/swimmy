import { auth } from 'firebase/app'
import React, { Component } from 'react'
import { AuthContext } from '../contexts/auth'

interface State {
  isLoggingIn: boolean
  isLogged: boolean
}

class AppAuthProvider extends Component {
  state: State = { isLoggingIn: true, isLogged: false }

  render() {
    const { children } = this.props

    return (
      <AuthContext.Provider
        value={{
          isLoggingIn: this.state.isLoggingIn,
          isLogged: this.state.isLogged
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  componentDidMount() {
    auth().onAuthStateChanged(res => {
      this.setState(() => {
        return {
          isLoggingIn: false,
          isLogged: Boolean(res)
        }
      })
    })
  }
}

export default AppAuthProvider

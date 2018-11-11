import { auth } from 'firebase/app'
import React from 'react'
import { AuthProvicer } from '../contexts/auth'

class Component extends React.Component<any, any> {
  state = { isLoggingIn: true, isLogged: false, uid: null }
  resetErrorMessage = () => {
    this.setState({ errorMessage: null })
  }

  render() {
    const { children } = this.props

    return (
      <AuthProvicer
        value={{
          uid: this.state.uid,
          isLoggingIn: this.state.isLoggingIn,
          isLogged: this.state.isLogged,
          signIn: this.signIn,
          signOut: this.signOut
        }}
      >
        {children}
      </AuthProvicer>
    )
  }

  componentDidMount() {
    auth().onAuthStateChanged(res => {
      this.setState(() => {
        return {
          isLoggingIn: false,
          isLogged: Boolean(res),
          uid: res ? res.uid : null
        }
      })
    })
  }
}

export const AppAuthProvider = Component

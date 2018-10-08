import { auth } from 'firebase/app'
import React, { Component } from 'react'
import { AuthProvicer } from '../contexts/auth'

class AppAuthProvider extends Component<any, any> {
  state = {
    uid: null,
    isLoggingIn: true,
    isLogged: false
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

  resetErrorMessage = () => {
    this.setState({ errorMessage: null })
  }
}

export default AppAuthProvider

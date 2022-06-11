import { LoginProvider } from "app/domain/valueObjects"

export class LoginProviderFactory {
  static fromText(text: string) {
    if (text === "google.com") {
      return LoginProviderFactory.google
    }
    return LoginProviderFactory.passoword
  }

  static get google() {
    return new LoginProvider("GOOGLE_COM")
  }

  static get passoword() {
    return new LoginProvider("PASSWORD")
  }
}

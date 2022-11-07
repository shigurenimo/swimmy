import { captureException } from "@sentry/node"
import { AuthenticationError, NotFoundError } from "blitz"
import { getAuth } from "firebase-admin/auth"
import { injectable } from "tsyringe"
import { Email, Id, LoginProviderFactory, UserFactory, Username } from "core"
import { FirebaseAdapter, UserRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  idToken: string
}

@injectable()
export class LoginService {
  constructor(
    private readonly firebaseAdapter: FirebaseAdapter,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: Props) {
    try {
      await this.firebaseAdapter.initialize()

      const decodedIdToken = await getAuth().verifyIdToken(props.idToken)

      if (typeof decodedIdToken.email === "undefined") {
        return new AuthenticationError()
      }

      if (
        decodedIdToken.firebase.sign_in_provider !== "google.com" &&
        decodedIdToken.firebase.sign_in_provider !== "password"
      ) {
        captureException("不明なログインプロバイダ")

        return new InternalError()
      }

      // バージョン5以前のユーザー
      if (decodedIdToken.firebase.sign_in_provider === "password") {
        // メールアドレスを持たないユーザー
        const user = decodedIdToken.email.endsWith("@swimmy.io")
          ? await this.userRepository.findByUsername(
              new Username(decodedIdToken.email.replace("@swimmy.io", ""))
            )
          : await this.userRepository.findByEmail(
              new Username(decodedIdToken.email)
            )

        if (user instanceof Error) {
          return new InternalError()
        }

        if (user === null) {
          return new NotFoundError()
        }

        return user
      }

      const user = await this.userRepository.findByEmail(
        new Email(decodedIdToken.email)
      )

      if (user instanceof Error) {
        return new InternalError()
      }

      if (user !== null) {
        return user
      }

      const newUser = UserFactory.create({
        id: new Id(decodedIdToken.uid),
        email: new Email(decodedIdToken.email),
        username: new Username(decodedIdToken.uid),
        loginProvider: LoginProviderFactory.fromText(
          decodedIdToken.firebase.sign_in_provider
        ),
      })

      await this.userRepository.persist(newUser)

      return newUser
    } catch (error) {
      captureException(error)
      if (error instanceof Error) {
        return new InternalError(error.message)
      }
      return new InternalError()
    }
  }
}

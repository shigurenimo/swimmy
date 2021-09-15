import {
  AuthenticationError,
  AuthorizationError,
  ErrorComponent,
  ErrorFallbackProps,
} from "blitz"
import { FunctionComponent } from "react"

export const RootErrorFallback: FunctionComponent<ErrorFallbackProps> = (
  props
) => {
  if (props.error instanceof AuthenticationError) {
    return (
      <ErrorComponent
        statusCode={props.error.statusCode}
        title={"Sorry, you are not authorized to access this"}
      />
    )
  }

  if (props.error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={props.error.statusCode}
        title={"Sorry, you are not authorized to access this"}
      />
    )
  }

  return (
    <ErrorComponent
      statusCode={props.error.statusCode || 400}
      title={props.error.message || props.error.name}
    />
  )
}

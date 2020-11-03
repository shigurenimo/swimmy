import { useEffect, useState } from 'react'
import { from } from 'rxjs'

export const usePromise = <T>(
  toPromise: () => Promise<T>,
  onNext?: (result: T) => void,
  onError?: (err: Error) => void
): [() => void, boolean, T | null, Error | null] => {
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<T | null>(null)

  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!loading) return

    if (error !== null) {
      setError(null)
    }

    if (data !== null) {
      setData(null)
    }

    const observable = from(toPromise())

    const subscription = observable.subscribe(
      (result) => {
        if (onNext) {
          onNext(result)
        }
        setData(result)
        setLoading(false)
      },
      (err) => {
        if (onError) {
          onError(err)
        }
        setError(err)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const callFunction = () => {
    if (loading) return

    setLoading(true)
  }

  return [callFunction, loading, data, error]
}

import { useContext, useEffect, useState } from 'react'
import { ajax } from 'rxjs/ajax'
import { MicroCMSContext } from './MicroCMSContext'
import { ListTypeResponse } from './types/ListTypeResponse'

export const useContents = <T>(resource: string) => {
  const { apiKey, serviceId } = useContext(MicroCMSContext)

  const [error, setError] = useState<Error | null>(null)

  const [data, setData] = useState<ListTypeResponse<T> | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const request = ajax({
      headers: { 'X-API-KEY': apiKey },
      method: 'GET',
      url: `https://${serviceId}.microcms.io/api/v1/${resource}`,
    })

    const subscription = request.subscribe(
      ({ response }: { response: ListTypeResponse<T> }) => {
        setData(response)
        setLoading(false)
      },
      err => {
        setError(err)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [apiKey, resource, serviceId])

  return { error, data, loading }
}

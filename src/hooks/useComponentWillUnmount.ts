import { useEffect } from 'react'

export const useComponentWillUnmount = (componentWillUnmount: () => void) => {
  return useEffect(() => {
    return () => componentWillUnmount()
  }, [])
}

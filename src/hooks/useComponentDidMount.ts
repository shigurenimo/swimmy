import { useEffect } from 'react'

export const useComponentDidMount = (componentDidMount: () => void) => {
  return useEffect(() => {
    componentDidMount()
  }, [])
}

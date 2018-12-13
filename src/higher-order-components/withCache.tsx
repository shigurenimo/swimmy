import React from 'react'

const cacheMap = new Map()

const create = (location: any) => {
  return {
    restore: () => {
      return cacheMap.get(location.pathname)
    },
    save: (state: any) => {
      cacheMap.set(location.pathname, state)
    }
  }
}

export const withCache = (RootComponent: any) => {
  return (props: any) => {
    return <RootComponent {...props} cache={create(props.location)} />
  }
}

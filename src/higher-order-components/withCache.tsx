import React from 'react'

const cacheMap = new Map()

const create = (location: any) => {
  return {
    save: (state: any) => {
      console.info('save', location.pathname)
      cacheMap.set(location.pathname, state)
    },
    restore: () => {
      const state = cacheMap.get(location.pathname)

      if (state) {
        console.info('restore', location.pathname)
      }

      return state
    }
  }
}

export const withCache = (RootComponent: any) => {
  return (props: any) => {
    return <RootComponent {...props} cache={create(props.location)} />
  }
}

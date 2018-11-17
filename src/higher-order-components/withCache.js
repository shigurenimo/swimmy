import React from 'react'

const cacheMap = new Map()

const create = location => {
  return {
    save: state => {
      console.info('save', location.pathname)
      cacheMap.set(location.pathname, state)
    },
    restore: use => {
      const state = cacheMap.get(location.pathname)

      if (state) {
        console.info('restore', location.pathname)
        use(state)
      }

      return Boolean(state)
    }
  }
}

export const withCache = RootComponent => {
  return props => {
    return <RootComponent {...props} cache={create(props.location)} />
  }
}

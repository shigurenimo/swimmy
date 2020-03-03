export const detectStandalone = (): boolean => {
  const _navigator = window.navigator as any

  const isAndroid = navigator.userAgent.match(/Android/i)

  const isStandalone = 'standalone' in _navigator && _navigator.standalone

  return isAndroid || isStandalone
}

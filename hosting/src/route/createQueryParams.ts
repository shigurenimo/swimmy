type ArrayParams = [string, string][]

export const createQueryParams = (array: ArrayParams) => {
  return array.map(param => param.join('=')).join('&')
}

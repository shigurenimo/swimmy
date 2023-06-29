export type PrismaResolvers<T, U> = {
  [K in keyof T]: (parent: U) => unknown
}

import type { z } from "zod"

type Props<T extends z.ZodType> = {
  schema: T
  path: string
  method: "GET" | "POST"
  body: unknown
}

/**
 * レスポンスをzodスキーマで検証して返す。失敗時はthrowするのでreact-queryがエラーとして扱う
 */
export async function fetchApi<T extends z.ZodType>(props: Props<T>): Promise<z.infer<T>> {
  const response = await fetch(props.path, {
    method: props.method,
    headers: props.body === null ? undefined : { "Content-Type": "application/json" },
    body: props.body === null ? undefined : JSON.stringify(props.body),
  })

  if (!response.ok) {
    throw new Error(`APIリクエストに失敗しました (${response.status})`)
  }

  return props.schema.parse(await response.json())
}

import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { idSchema } from "@/interface/api/id-schema"

export const useFileUploader = () => {
  const upload = async (file: File) => {
    const response = await fetch("/api/images", { method: "POST", body: file })
    if (!response.ok) throw new Error(`画像のアップロードに失敗しました (${response.status})`)
    return z.object({ fileId: idSchema }).parse(await response.json()).fileId
  }

  return useMutation({ mutationFn: upload })
}

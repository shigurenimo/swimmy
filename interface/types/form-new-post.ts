import type { CreatePostInput } from "@/interface/api/create-post-input-schema"

export type FormNewPost = Pick<CreatePostInput, "text" | "fileIds">

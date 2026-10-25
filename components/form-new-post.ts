import type { CreatePostInput } from "@/api/create-post-input-schema"

export type FormNewPost = Pick<CreatePostInput, "text" | "fileIds">

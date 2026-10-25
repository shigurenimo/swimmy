import { metadataHead, pageMetadata, siteDescription } from "@/metadata"

export const head = () => metadataHead(pageMetadata({ description: siteDescription, path: "/" }))

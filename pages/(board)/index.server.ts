import { metadataHead, pageMetadata, siteDescription } from "@/app/metadata"

export const head = () => metadataHead(pageMetadata({ description: siteDescription, path: "/" }))

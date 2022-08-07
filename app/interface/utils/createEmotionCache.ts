import createCache from "@emotion/cache"

/**
 * https://github.com/mui/material-ui/blob/next/examples/nextjs-with-typescript/pages/_document.tsx
 * @returns
 */
export const createEmotionCache = () => {
  let insertionPoint

  if (typeof document !== "undefined") {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  return createCache({ key: "mui-style", insertionPoint })
}

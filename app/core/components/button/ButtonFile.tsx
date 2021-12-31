import { LoadingButton, LoadingButtonProps } from "@mui/lab"
import React, { FC, useRef } from "react"

type Props = Omit<LoadingButtonProps, "onChange"> & {
  onChange(file: File): void
}

export const ButtonFile: FC<Props> = ({ onChange, ...props }) => {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <>
      <LoadingButton
        {...props}
        onClick={() => {
          ref?.current?.click()
        }}
      />
      <input
        type={"file"}
        style={{ display: "none" }}
        ref={ref}
        onChange={(event) => {
          if (event.target.files === null) {
            return null
          }
          const [file] = Array.from(event.target.files)
          if (typeof file === "undefined") {
            return null
          }
          onChange(file)
        }}
      />
    </>
  )
}

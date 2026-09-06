import { type ComponentProps, type FC, useRef } from "react"
import { Button } from "@/components/ui/button"

export type ButtonFileProps = Omit<ComponentProps<typeof Button>, "onChange"> & {
  onChange(file: File): void
  loading?: boolean
}

export const ButtonFile: FC<ButtonFileProps> = ({ onChange, loading, ...props }) => {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button
        {...props}
        disabled={props.disabled || loading}
        onClick={() => {
          ref?.current?.click()
        }}
      >
        {loading ? "アップロード中..." : props.children}
      </Button>
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

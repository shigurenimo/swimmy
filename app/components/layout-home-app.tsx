import Link from "next/link"
import type { FC, ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const LayoutHomeApp: FC<Props> = (props) => {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto w-full max-w-[64rem] flex-1">{props.children}</main>
      <footer className="mx-auto flex w-full max-w-[64rem] shrink-0 items-center justify-between gap-4 border-t p-4 text-xs text-muted-foreground">
        <Link href="/" className="font-bold">
          スイミー
        </Link>
        <nav className="flex gap-4" aria-label="サイト情報">
          <Link href="/terms" className="hover:text-foreground">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            プライバシー
          </Link>
        </nav>
      </footer>
    </div>
  )
}

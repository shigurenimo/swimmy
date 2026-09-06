import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8">
      <span className="font-bold text-4xl">404</span>
      <p className="text-muted-foreground">ページが見つかりません</p>
      <Link href="/" className={buttonVariants({ variant: "secondary" })}>
        ホームに戻る
      </Link>
    </div>
  )
}

import { Button } from "@/components/ui/button"

type Props = {
  isRetrying: boolean
  onRetry(): void
}

export function BoxQueryError(props: Props) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 text-sm">
      <p>読み込めませんでした。もう一度お試しください。</p>
      <Button variant="secondary" disabled={props.isRetrying} onClick={props.onRetry}>
        {props.isRetrying ? "読み込み中..." : "再試行"}
      </Button>
    </div>
  )
}

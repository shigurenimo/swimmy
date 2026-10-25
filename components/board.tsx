import { MessageSquare } from "lucide-react"
import { useParams, useRouter } from "@void/react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BoxAsideFeedThread } from "@/components/box-aside-feed-thread"
import { BoxMainFeed } from "@/components/box-main-feed"
import { BoxPostList } from "@/components/box-post-list"
import { unregister } from "@/components/service-worker"
import { cn } from "cn"

export function Board() {
  const router = useRouter()
  const pathname = router.path
  const params = useParams<{ id: string }>()
  const threadId = params?.id ?? null
  const [activeTab, setActiveTab] = useState<"home" | "threads">(
    pathname === "/" ? "home" : "threads",
  )
  const [previousPathname, setPreviousPathname] = useState(pathname)

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname)
    if (pathname === "/" || pathname === "/threads") {
      setActiveTab(pathname === "/" ? "home" : "threads")
    }
  }

  useEffect(() => {
    unregister()
  }, [])

  useEffect(() => {
    if (window.matchMedia("(width < 48rem)").matches) {
      window.scrollTo({ top: 0 })
    }
  }, [threadId])

  const closeThread = () => {
    router.visit(activeTab === "home" ? "/" : "/threads", { preserveScroll: true })
  }

  return (
    <div className="grid items-start md:grid-cols-2">
      <section
        key={threadId}
        className={cn(
          "min-w-0 md:sticky md:top-0 md:h-svh md:overflow-y-auto",
          !threadId && "hidden md:block",
        )}
        aria-label="スレッドの内容"
      >
        {threadId ? (
          <BoxAsideFeedThread threadId={threadId} onClose={closeThread} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center text-muted-foreground">
            <MessageSquare className="size-8" />
            <p className="font-medium text-foreground">スレッドを選択</p>
            <p className="text-base">右の一覧から選ぶと、本文と返信がここに表示されます。</p>
          </div>
        )}
      </section>
      <section
        className={cn("min-h-svh min-w-0 md:border-l", threadId && "hidden md:block")}
        aria-label="投稿一覧"
      >
        <Tabs
          value={activeTab}
          onValueChange={(tab) => {
            if (tab === "home" || tab === "threads") {
              setActiveTab(tab)
              if (!threadId) {
                router.visit(tab === "home" ? "/" : "/threads", { preserveScroll: true })
              }
            }
          }}
        >
          <div className="flex flex-col">
            <div className="sticky top-0 z-16 flex items-center bg-background p-4">
              <TabsList aria-label="投稿一覧の切り替え">
                <TabsTrigger value="home">ホーム</TabsTrigger>
                <TabsTrigger value="threads">スレッド</TabsTrigger>
              </TabsList>
            </div>
            <div className="px-4 pb-4">
              <TabsContent value="home" keepMounted>
                <BoxMainFeed threadId={threadId} />
              </TabsContent>
              <TabsContent value="threads" keepMounted>
                <BoxPostList resource="threads" threadId={threadId} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </section>
    </div>
  )
}

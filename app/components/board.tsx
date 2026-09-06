"use client"

import { MessageSquare } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BoxAsideFeedThread } from "@/interface/components/box/box-aside-feed-thread"
import { BoxMainFeed } from "@/interface/components/box/box-main-feed"
import { BoxMainFeedThread } from "@/interface/components/box/box-main-feed-thread"
import { unregister } from "@/interface/utils/service-worker"
import { cn } from "@/lib/utils"

type Props = {
  initialTab: "home" | "threads"
  threadId: string | null
}

export function Board(props: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const threadId = props.threadId ?? searchParams.get("threadId")
  const [activeTab, setActiveTab] = useState(props.initialTab)

  useEffect(() => {
    unregister()
  }, [])

  useEffect(() => {
    if (window.matchMedia("(width < 48rem)").matches) {
      window.scrollTo({ top: 0 })
    }
  }, [threadId])

  const closeThread = () => {
    router.push(activeTab === "home" ? "/" : "/threads", { scroll: false })
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
            <p className="text-sm">右の一覧から選ぶと、本文と返信がここに表示されます。</p>
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
            }
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="sticky top-0 z-16 flex items-center bg-background px-4 pt-4">
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
                <BoxMainFeedThread threadId={threadId} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </section>
    </div>
  )
}

"use client"

import { MessageSquare } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BoxAsideFeedThread } from "@/interface/components/box/box-aside-feed-thread"
import { BoxMainFeed } from "@/interface/components/box/box-main-feed"
import { BoxMainFeedThread } from "@/interface/components/box/box-main-feed-thread"
import { unregister } from "@/interface/utils/service-worker"

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

  const closeThread = () => {
    router.push(activeTab === "home" ? "/" : "/threads", { scroll: false })
  }

  return (
    <div className="grid grid-cols-2 items-start">
      <section
        key={threadId}
        className="sticky top-0 h-svh min-w-0 overflow-y-auto"
        aria-label="スレッドの内容"
      >
        {threadId ? (
          <BoxAsideFeedThread threadId={threadId} onClose={closeThread} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground">
            <MessageSquare className="size-8" />
            <p className="font-medium text-foreground">スレッドを選択</p>
            <p className="text-sm">右の一覧から選ぶと、本文と返信がここに表示されます。</p>
          </div>
        )}
      </section>
      <Tabs
        value={activeTab}
        onValueChange={(tab) => {
          if (tab === "home" || tab === "threads") {
            setActiveTab(tab)
          }
        }}
        className="min-h-svh min-w-0 border-l"
      >
        <div className="sticky top-0 z-16 flex h-16 items-center border-b bg-background px-4">
          <TabsList className="grid w-full grid-cols-2" aria-label="投稿一覧の切り替え">
            <TabsTrigger value="home">ホーム</TabsTrigger>
            <TabsTrigger value="threads">スレッド</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="home" keepMounted className="mt-0">
          <BoxMainFeed threadId={threadId} />
        </TabsContent>
        <TabsContent value="threads" keepMounted className="mt-0">
          <BoxMainFeedThread threadId={threadId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

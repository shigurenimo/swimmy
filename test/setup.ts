import { GlobalRegistrator } from "@happy-dom/global-registrator"

// MiniflareのHTTP終了処理にはunrefできるNode.jsタイマーが必要。
const timers = { setTimeout, clearTimeout, setInterval, clearInterval }
GlobalRegistrator.register({ url: "http://localhost:3000" })
Object.assign(globalThis, timers)

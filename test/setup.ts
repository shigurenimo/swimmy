import { GlobalRegistrator } from "@happy-dom/global-registrator"

// MiniflareのHTTP終了処理にはunrefできるNode.jsタイマーが必要。
const timers = { setTimeout, clearTimeout, setInterval, clearInterval }
GlobalRegistrator.register()
Object.assign(globalThis, timers)

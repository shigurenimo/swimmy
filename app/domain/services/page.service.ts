import { Count } from "app/domain/valueObjects"

/**
 * ページング
 */
export class PageService {
  hasMore(take: number, skip: number, count: Count) {
    return skip! + take! < count.value
  }

  nextPage(take: number, skip: number) {
    return { take: take, skip: skip! + take! }
  }
}

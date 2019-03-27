import { useEffect, useState } from 'react'
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { Changelog } from '../types/models/changelog'

export const usePrismicChangelogs = (): [[Changelog[], boolean]] => {
  const [changelogs, setChangelogs] = useState<Changelog[]>([])
  const [inProgress, setInProgress] = useState(true)

  useEffect(() => {
    const endpoint =
      'https://umfzwkzvrtpe.cdn.prismic.io/api/v2/documents/search'
    const params = [
      ['ref', 'XJe41RIAANWu9VKB'],
      ['q', '[[at(document.type,"changelog")]]'],
      ['orderings', '[my.changelog.version desc]']
    ]
      .map(param => param.join('='))
      .join('&')
    const url = `${endpoint}?${params}`
    const fetch$$ = from(fetch(url))
      .pipe(
        mergeMap(promise => promise.json()),
        map(res => res.results),
        map(results => results.map((result: any) => result.data)),
        map(docs => docs as Changelog[])
      )
      .subscribe(_changelogs => {
        setChangelogs(_changelogs)
        setInProgress(false)
      })
    return () => {
      fetch$$.unsubscribe()
    }
  }, [])

  return [[changelogs, inProgress]]
}

import { useEffect, useState } from 'react'
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { createQueryParams } from '../helpers/createQueryParams'
import { getPrismicEndpoint } from '../helpers/getPrismicEndpoint'
import { getPrismicRef } from '../helpers/getPrismicRef'
import { Changelog } from '../types/models/changelog'

export const usePrismicChangelogs = (): [[Changelog[], boolean]] => {
  const [changelogs, setChangelogs] = useState<Changelog[]>([])
  const [inProgress, setInProgress] = useState(true)

  useEffect(() => {
    const endpoint = getPrismicEndpoint()
    const fetch$$ = getPrismicRef()
      .pipe(
        mergeMap(promise => promise.json()),
        map(res => res.refs[0].ref),
        map(ref =>
          createQueryParams([
            ['ref', ref],
            ['q', '[[at(document.type,"changelog")]]'],
            ['orderings', '[my.changelog.version desc]']
          ])
        ),
        mergeMap(params =>
          from(fetch(`${endpoint}/documents/search?${params}`))
        ),
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

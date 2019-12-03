import { firestore } from 'firebase/app'
import { useEffect, useState } from 'react'
import { collectionData } from 'rxfire/firestore'
import { STATISTICS } from '../../firestore/constants/collection'
import { DESC } from '../../firestore/constants/order'
import { Statistic } from '../../firestore/types/statistic'

export const useStatistic = (): [Statistic | null, boolean] => {
  const [loading, setLoading] = useState(true)

  const [statistic, setStatistic] = useState<Statistic | null>(null)

  useEffect(() => {
    const subscription = collectionData<Statistic>(
      firestore()
        .collection(STATISTICS)
        .orderBy('createdAt', DESC)
        .limit(1)
    ).subscribe(statistics => {
      if (!statistics.length) {
        setLoading(false)
        return
      }
      const [statistic] = statistics
      setStatistic(statistic)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  return [statistic, loading]
}

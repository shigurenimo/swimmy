import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

type Session = {
  userId: string | null
}

export const useSession = (): Session => {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null)
    })
    return () => unsubscribe()
  }, [])

  return { userId }
}

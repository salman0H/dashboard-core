import { useState, useEffect } from 'react'
import { fetchMenuSections, type MenuSection } from '@/services/menu.service'

interface UseMenuResult {
  sections: MenuSection[]
  loading: boolean
  error: string | null
}

/**
 * Pure data hook — same inputs → same output over time (barring server changes).
 * Fetches once on mount. No side effects during render.
 */
export function useMenu(): UseMenuResult {
  const [sections, setSections] = useState<MenuSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fetchMenuSections()
      .then((data) => {
        if (!cancelled) setSections(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load menu')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { sections, loading, error }
}

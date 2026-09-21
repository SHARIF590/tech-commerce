import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const RouterContext = createContext(null)

export function useRouter() {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider')
  }
  return context
}

export function RouterProvider({ children }) {
  // Parse initial hash
  const parseHash = () => {
    const raw = window.location.hash.replace(/^#\/?/, '') || ''
    const parts = raw.split('?')[0].split('/')
    const queryString = raw.includes('?') ? raw.split('?')[1] : ''
    const searchParams = new URLSearchParams(queryString)

    let page = 'home'
    let param = ''

    if (parts[0]) {
      page = parts[0]
      if (parts[1]) {
        param = decodeURIComponent(parts[1])
      }
    }

    return {
      page,
      param,
      query: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
    }
  }

  const [route, setRoute] = useState(parseHash)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((path, queryObj = {}) => {
    let target = path.startsWith('/') ? path.substring(1) : path
    const params = new URLSearchParams()
    Object.entries(queryObj).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    const queryStr = params.toString() ? `?${params.toString()}` : ''
    window.location.hash = `#/${target}${queryStr}`
  }, [])

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

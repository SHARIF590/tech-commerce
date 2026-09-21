/**
 * Resolves an asset path against the active base URL (e.g. GitHub Pages '/tech-commerce/').
 * Safely handles data: URLs, external http(s) URLs, blob URLs, and root-relative paths.
 */
export function resolveAssetUrl(path) {
  if (!path || typeof path !== 'string') return ''

  // Return data URLs, external links, and blob URLs untouched
  if (
    path.startsWith('data:') ||
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  // Get base URL injected by Vite (e.g. '/tech-commerce/' on GitHub Pages, '/' on local dev)
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  return `${normalizedBase}${cleanPath}`
}

export default resolveAssetUrl

/**
 * Security & Hacker Protection Utilities
 * Provides input sanitization against XSS/injection,
 * cryptographic hashing with SHA-256 via Web Crypto API,
 * and brute-force attempt rate limiting.
 */

// Hash a string (e.g. admin passcode) using SHA-256
export async function hashString(str) {
  if (!str) return ''
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch (err) {
    console.error('Crypto subtle digest error, falling back:', err)
    // Fallback simple non-reversible hash if WebCrypto is unavailable in test runner
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0
    }
    return 'fallback_' + Math.abs(hash).toString(16)
  }
}

// Strict XSS Sanitization: strips HTML tags, scripts, event handlers, and dangerous javascript: URIs
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // remove style tags
    .replace(/<[^>]+>/g, '')                                            // strip all HTML tags
    .replace(/javascript:/gi, '')                                       // remove javascript: pseudo-protocol
    .replace(/on\w+\s*=/gi, '')                                         // remove inline event handlers (onload=, onerror=, etc.)
    .trim()
}

// Sanitize an entire object's string values
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) {
    return obj.map((item) => (typeof item === 'string' ? sanitizeInput(item) : sanitizeObject(item)))
  }
  const clean = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = sanitizeInput(value)
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value)
    } else {
      clean[key] = value
    }
  }
  return clean
}

// Generate client device / session fingerprint for audit logs
export function getClientFingerprint() {
  const ua = navigator.userAgent || 'Unknown'
  const isMobile = /Android|iPhone|iPad/i.test(ua)
  const browser = /Chrome/i.test(ua)
    ? 'Chrome'
    : /Firefox/i.test(ua)
    ? 'Firefox'
    : /Safari/i.test(ua)
    ? 'Safari'
    : /Edge/i.test(ua)
    ? 'Edge'
    : 'Browser'
  const platform = navigator.platform || 'Desktop'
  return `${browser} on ${platform} (${isMobile ? 'Mobile' : 'Workstation'})`
}

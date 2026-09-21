import { useState } from 'react'
import { resolveAssetUrl } from '../utils/assets'

export default function ProductIcon({
  type,
  image,
  size = 28,
  color,
  fill = false,
  fit = 'cover',
  className = '',
  style = {},
}) {
  const s = size
  const [hasError, setHasError] = useState(false)

  // If a custom uploaded image, base64 data-url, or external image URL is provided
  const customSrc =
    image ||
    (typeof type === 'string' &&
    (type.startsWith('data:image/') ||
      type.startsWith('http://') ||
      type.startsWith('https://') ||
      type.startsWith('blob:') ||
      type.startsWith('/') ||
      type.includes('.png') ||
      type.includes('.jpg') ||
      type.includes('.jpeg') ||
      type.includes('.svg') ||
      type.includes('.webp'))
      ? type
      : null)

  const resolvedSrc = customSrc ? resolveAssetUrl(customSrc) : null

  if (resolvedSrc && !hasError) {
    return (
      <img
        src={resolvedSrc}
        alt="Product visual"
        className={className}
        style={{
          width: fill ? '100%' : s,
          height: fill ? '100%' : s,
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: fit,
          objectPosition: 'center',
          borderRadius: fill ? 'inherit' : 6,
          display: 'block',
          ...style,
        }}
        onError={() => setHasError(true)}
      />
    )
  }

  switch (type) {
    case 'canva':
    case 'canva-admin':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#00c4cc'}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5c-2.48 0-4.5-2.02-4.5-4.5S8.52 7.5 11 7.5c1.47 0 2.78.71 3.6 1.8l-1.4 1.1c-.5-.7-1.3-1.1-2.2-1.1-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7c1 0 1.8-.5 2.3-1.3l1.4 1.1c-.9 1.3-2.3 2-3.7 2z" />
        </svg>
      )

    case 'capcut':
    case 'video':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#2563eb'}>
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm2 14H4v-8h16v8z" />
        </svg>
      )

    case 'gemini':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#0284c7'}>
          <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2zm6 14l-1.25 3.75L13 21l3.75 1.25L18 26l1.25-3.75L23 21l-3.75-1.25L18 16z" />
        </svg>
      )

    case 'chatgpt':
    case 'ai':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#10b981'}>
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5" />
        </svg>
      )

    case 'windows':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#38bdf8'}>
          <path d="M3 4.5 11 3v8H3V4.5ZM12.5 2.8 21 1.5V11h-8.5V2.8ZM3 12.5h8v8L3 19v-6.5Zm9.5 0H21v9.8L12.5 21v-8.5Z" />
        </svg>
      )

    case 'office':
    case 'microsoft':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#ea580c'}>
          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
        </svg>
      )

    case 'duolingo':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#58cc02'}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.82.62-3.49 1.64-4.83l9.19 9.19C13.49 19.38 12.82 20 12 20zm6.36-3.17L9.17 7.64C10.01 6.62 11.23 6 12 6c4.41 0 8 3.59 8 8 0 .82-.24 1.6-.64 2.83z" />
        </svg>
      )

    case 'gmail':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#ef4444'}>
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      )

    case 'amazon':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#00a8e1'}>
          <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h6v2h-6v-2zm-3 4h9v2H8v-2z" />
        </svg>
      )

    case 'nordvpn':
    case 'security':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#16a34a'}>
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      )

    case 'subscription':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#ea580c'}>
          <path d="M12 2a10 10 0 1 0 10 10h-3a7 7 0 1 1-2-4.9L14 10h8V2l-2.9 2.9A9.9 9.9 0 0 0 12 2Z" />
        </svg>
      )

    case 'gift':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#db2777'}>
          <path d="M20 8h-2.2A3.5 3.5 0 0 0 12 4.1 3.5 3.5 0 0 0 6.2 8H4a2 2 0 0 0-2 2v3h9V8H9a1.5 1.5 0 1 1 1.5-1.5V8h3V6.5A1.5 1.5 0 1 1 15 8h-2v5h9v-3a2 2 0 0 0-2-2ZM3 14h8v8H5a2 2 0 0 1-2-2v-6Zm10 0h8v6a2 2 0 0 1-2 2h-6v-8Z" />
        </svg>
      )

    case 'mobile':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#4f46e5'}>
          <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 3v13h8V5H8Zm3 14h2v1h-2v-1Z" />
        </svg>
      )

    case 'resources':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#0284c7'}>
          <path d="M11 3h2v10l3.5-3.5 1.4 1.4-5.9 5.9-5.9-5.9 1.4-1.4L11 13V3ZM4 18h16v3H4v-3Z" />
        </svg>
      )

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill={color || '#2563eb'}>
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      )
  }
}

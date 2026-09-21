export default function CategoryIcon({ category, iconType, className = '' }) {
  const id = (category?.id || '').toLowerCase()
  const name = (category?.name || '').toLowerCase()
  const type = (iconType || category?.iconType || '').toLowerCase()

  // 1. AI Services
  if (
    type === 'ai' ||
    id.includes('ai') ||
    name.includes('ai') ||
    name.includes('gpt') ||
    name.includes('claude') ||
    name.includes('gemini')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9 2h6l1 3 3 1 3 5-2 3v4l-5 4H9l-5-4v-4l-2-3 3-5 3-1 1-3Zm-1 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-7 6h6v2H9v-2Z" />
      </svg>
    )
  }

  // 2. Creative & Video
  if (
    type === 'creative' ||
    type === 'video' ||
    type === 'design' ||
    type === 'resources' ||
    id.includes('creative') ||
    id.includes('video') ||
    name.includes('creative') ||
    name.includes('video') ||
    name.includes('design') ||
    name.includes('capcut') ||
    name.includes('canva') ||
    name.includes('media')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m22 8-6 4 6 4V8Z" />
        <rect x="2" y="6" width="14" height="12" rx="3" />
        <circle cx="9" cy="12" r="2" />
      </svg>
    )
  }

  // 3. Education & Productivity
  if (
    type === 'education' ||
    type === 'learning' ||
    type === 'productivity' ||
    type === 'study' ||
    id.includes('education') ||
    id.includes('learning') ||
    name.includes('education') ||
    name.includes('learning') ||
    name.includes('course') ||
    name.includes('study') ||
    name.includes('productivity') ||
    name.includes('coursera')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 3 3 5 6 5s6-2 6-5v-5" />
      </svg>
    )
  }

  // 4. Microsoft Office
  if (
    type === 'microsoft' ||
    type === 'office' ||
    id.includes('microsoft') ||
    id.includes('office') ||
    name.includes('microsoft') ||
    name.includes('office') ||
    name.includes('365')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="3" y="3" width="8.5" height="8.5" rx="1.5" />
        <rect x="12.5" y="3" width="8.5" height="8.5" rx="1.5" />
        <rect x="3" y="12.5" width="8.5" height="8.5" rx="1.5" />
        <rect x="12.5" y="12.5" width="8.5" height="8.5" rx="1.5" />
      </svg>
    )
  }

  // 5. Windows Licences
  if (
    type === 'windows' ||
    type === 'os' ||
    id.includes('windows') ||
    id.includes('licence') ||
    id.includes('license') ||
    name.includes('windows') ||
    name.includes('licence') ||
    name.includes('license')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.95" />
      </svg>
    )
  }

  // 6. Cloud & Workspace
  if (
    type === 'cloud' ||
    type === 'workspace' ||
    type === 'storage' ||
    id.includes('cloud') ||
    id.includes('workspace') ||
    name.includes('cloud') ||
    name.includes('workspace') ||
    name.includes('drive') ||
    name.includes('storage') ||
    name.includes('backup')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    )
  }

  // 7. Meta & Ad Verification / Digital Marketing
  if (
    type === 'marketing' ||
    type === 'meta' ||
    type === 'social' ||
    id.includes('marketing') ||
    id.includes('meta') ||
    name.includes('meta') ||
    name.includes('ad') ||
    name.includes('marketing') ||
    name.includes('facebook') ||
    name.includes('verification')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1L9.2 3.8 5.4 3.7 4 7.4 1 9.8 2 13.7 1 17.6 4 20l1.4 3.7 3.8-.1L12 23l2.8-2.4 3.8.1 1.4-3.7 3-2.4-1-3.9 1-3.9-3-2.4-1.4-3.7-3.8.1L12 1zm-1.4 14.8l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z" />
      </svg>
    )
  }

  // 8. Privacy & Security / Antivirus / VPN
  if (
    type === 'security' ||
    type === 'privacy' ||
    type === 'antivirus' ||
    type === 'vpn' ||
    id.includes('security') ||
    id.includes('privacy') ||
    id.includes('antivirus') ||
    name.includes('security') ||
    name.includes('privacy') ||
    name.includes('antivirus') ||
    name.includes('vpn') ||
    name.includes('protection')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }

  // 9. Subscriptions & Streaming
  if (
    type === 'subscription' ||
    type === 'streaming' ||
    id.includes('subscription') ||
    name.includes('subscription') ||
    name.includes('streaming') ||
    name.includes('netflix') ||
    name.includes('spotify')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10h-3a7 7 0 1 1-2-4.9L14 10h8V2l-2.9 2.9A9.9 9.9 0 0 0 12 2Z" />
      </svg>
    )
  }

  // 10. Developer & Code
  if (
    type === 'code' ||
    type === 'dev' ||
    id.includes('code') ||
    id.includes('dev') ||
    name.includes('code') ||
    name.includes('dev') ||
    name.includes('programming') ||
    name.includes('cursor')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  }

  // 11. Gaming
  if (
    type === 'gaming' ||
    type === 'game' ||
    id.includes('game') ||
    name.includes('game') ||
    name.includes('steam') ||
    name.includes('playstation') ||
    name.includes('xbox')
  ) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="6" y1="12" x2="10" y2="12" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <line x1="15" y1="13" x2="15.01" y2="13" />
        <line x1="18" y1="11" x2="18.01" y2="11" />
        <rect width="20" height="12" x="2" y="6" rx="6" />
      </svg>
    )
  }

  // 12. More / Expand Icon
  if (type === 'more' || id === 'more') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="12" r="2.5" />
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="19" cy="12" r="2.5" />
      </svg>
    )
  }

  // 13. Smart Fallback: Premium 4-Block Application Grid (Never blank!)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="7" height="7" x="3" y="3" rx="1.5" />
      <rect width="7" height="7" x="14" y="3" rx="1.5" />
      <rect width="7" height="7" x="14" y="14" rx="1.5" />
      <rect width="7" height="7" x="3" y="14" rx="1.5" />
    </svg>
  )
}

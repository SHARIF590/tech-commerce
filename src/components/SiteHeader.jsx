import { useState, useRef, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useRouter } from '../context/RouterContext'

export default function SiteHeader() {
  const { count } = useCart()
  const { route, navigate } = useRouter()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [query, setQuery] = useState('')
  const moreRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) {
      navigate('shop')
    } else {
      navigate('shop', { q: query.trim() })
    }
  }

  const handleNav = (path) => {
    setMobileNavOpen(false)
    setMoreOpen(false)
    navigate(path)
  }

  const isMoreActive =
    route.page === 'about' ||
    route.page === 'legal' ||
    (route.page === 'category' &&
      ['windows-licences', 'privacy-security', 'microsoft'].includes(route.param))

  return (
    <header className="site-header">
      {/* Top Corporate Reseller Trust Strip */}
      <div style={{ background: '#050e1f', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '5px 0', fontSize: 11, color: '#94a3b8' }}>
        <div className="shell" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--green)', fontWeight: 700 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Verified Independent IT Product Reseller
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span>Dhanmondi-32, Dhaka-1207 (Est. 2016)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a onClick={() => handleNav('legal')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>
              Reseller Policy &amp; Terms
            </a>
            <span style={{ color: '#334155' }}>|</span>
            <a href="tel:+8801738979790" style={{ color: 'var(--cyan)', fontWeight: 700 }}>
              Hotline: +88 01738-979790
            </a>
          </div>
        </div>
      </div>

      {/* Top Header Main Bar */}
      <div className="header-main shell">
        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Brand Logo */}
        <a className="brand" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-badge">S</div>
          <div className="brand-text">
            <div className="brand-title">
              Shopno<span>IT</span>
            </div>
            <div className="brand-tag">Authorized Reseller</div>
          </div>
        </a>

        {/* Live Search Form */}
        <form className="search" onSubmit={handleSearch}>
          <input
            name="q"
            type="search"
            value={query}
            placeholder="Search for products..."
            aria-label="Search products"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m21 19.6-5.2-5.2a7.5 7.5 0 1 0-1.4 1.4l5.2 5.2 1.4-1.4ZM5 10a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" />
            </svg>
          </button>
        </form>

        {/* Support Pill Button */}
        <a
          className="support"
          href="https://wa.me/8801738979790?text=Hello%20Shopno%20IT%20Support,%20I%20need%20assistance"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span />
          <strong>
            Shopno IT Support
            <small>01738-979790</small>
          </strong>
        </a>
      </div>

      {/* Navigation Bar */}
      <div className={`header-nav ${mobileNavOpen ? 'mobile-open' : ''}`}>
        <nav className="shell">
          {/* Essential Nav Buttons */}
          <a
            className={route.page === 'shop' && !route.param ? 'active-link' : ''}
            onClick={() => handleNav('shop')}
          >
            All Products
          </a>
          <a
            className={route.page === 'category' && route.param === 'ai-services' ? 'active-link' : ''}
            onClick={() => handleNav('category/ai-services')}
          >
            AI Services
          </a>
          <a
            className={route.page === 'category' && route.param === 'subscriptions' ? 'active-link' : ''}
            onClick={() => handleNav('category/subscriptions')}
          >
            Subscriptions
          </a>
          <a
            className={route.page === 'track-order' ? 'active-link' : ''}
            style={{ color: '#f59e0b', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => handleNav('track-order')}
          >
            Track Order
          </a>
          <a
            className={route.page === 'contact' ? 'active-link' : ''}
            onClick={() => handleNav('contact')}
            style={{ color: '#22b8f0', fontWeight: 700 }}
          >
            Contact
          </a>

          {/* Three-Dot Section for Others (More Categories & Policies) */}
          <div className="nav-more-wrapper" ref={moreRef}>
            <button
              type="button"
              className={`nav-more-trigger ${moreOpen ? 'open' : ''} ${isMoreActive ? 'has-active' : ''}`}
              onClick={() => setMoreOpen(!moreOpen)}
              aria-label="More navigation options"
              aria-expanded={moreOpen}
              title="More Categories & Policies"
            >
              <span className="three-dots-icon" aria-hidden="true">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
              <span className="more-label">More</span>
              <svg className="chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
              {isMoreActive && <span className="active-glow-pip" title="Active page in this section" />}
            </button>

            {moreOpen && (
              <div className="nav-more-menu" role="menu">
                <span className="nav-dropdown-group-label">More Categories</span>

                <a
                  className={`nav-dropdown-item ${route.page === 'category' && route.param === 'windows-licences' ? 'active' : ''}`}
                  onClick={() => handleNav('category/windows-licences')}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.95" />
                    </svg>
                  </div>
                  <div>
                    <span className="nav-dropdown-title">Windows Licences</span>
                    <span className="nav-dropdown-desc">Windows 11 &amp; 10 Pro Genuine Keys</span>
                  </div>
                </a>

                <a
                  className={`nav-dropdown-item ${route.page === 'category' && route.param === 'privacy-security' ? 'active' : ''}`}
                  onClick={() => handleNav('category/privacy-security')}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <span className="nav-dropdown-title">Security &amp; Privacy</span>
                    <span className="nav-dropdown-desc">Antivirus, VPN &amp; Protection Keys</span>
                  </div>
                </a>

                <a
                  className={`nav-dropdown-item ${route.page === 'category' && route.param === 'microsoft' ? 'active' : ''}`}
                  onClick={() => handleNav('category/microsoft')}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="2" width="9" height="9" rx="1.5" />
                      <rect x="13" y="2" width="9" height="9" rx="1.5" />
                      <rect x="2" y="13" width="9" height="9" rx="1.5" />
                      <rect x="13" y="13" width="9" height="9" rx="1.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="nav-dropdown-title">Microsoft Solutions</span>
                    <span className="nav-dropdown-desc">Office 365, OneDrive &amp; Cloud Apps</span>
                  </div>
                </a>

                <div className="nav-dropdown-divider" />

                <span className="nav-dropdown-group-label">Company &amp; Trust</span>

                <a
                  className={`nav-dropdown-item ${route.page === 'about' ? 'active' : ''}`}
                  onClick={() => handleNav('about')}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <span className="nav-dropdown-title">About Shopno IT</span>
                    <span className="nav-dropdown-desc">Dhanmondi Hub, Story &amp; Verification</span>
                  </div>
                </a>

                <a
                  className={`nav-dropdown-item ${route.page === 'legal' ? 'active' : ''}`}
                  onClick={() => handleNav('legal')}
                  role="menuitem"
                >
                  <div className="nav-dropdown-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <span className="nav-dropdown-title">Legal &amp; Policy</span>
                    <span className="nav-dropdown-desc">Reseller Terms, Warranties &amp; Refunds</span>
                  </div>
                </a>
              </div>
            )}
          </div>

          <span className="nav-spacer" />

          {/* Account Login / Admin Portal icon */}
          <button
            className="icon-link"
            aria-label="Merchant Login & Management"
            title="Owner Portal (Passcode: shopno2026)"
            onClick={() => handleNav('admin')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-9 10a9 9 0 0 1 18 0H3Z" />
            </svg>
          </button>

          {/* Cart Link with Badge */}
          <button
            className="cart-link"
            onClick={() => handleNav('cart')}
            aria-label="Shopping Cart"
          >
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 3h2l2.2 11h10.6l2-7H7M9 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              </svg>
              <b data-cart-count>{count}</b>
            </span>
            <strong>
              Cart
              <small>View basket</small>
            </strong>
          </button>
        </nav>
      </div>
    </header>
  )
}

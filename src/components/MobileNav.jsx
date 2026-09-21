import { useRouter } from '../context/RouterContext'

export default function MobileNav() {
  const { route, navigate } = useRouter()

  return (
    <nav className="mob-nav" id="mobNav">
      <a
        className={`mob-nav-item ${route.page === 'home' ? 'mob-nav-active' : ''}`}
        onClick={() => navigate('home')}
      >
        <span className="mob-nav-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </span>
        <span className="mob-nav-label">Home</span>
      </a>

      <a
        className={`mob-nav-item ${route.page === 'shop' ? 'mob-nav-active' : ''}`}
        onClick={() => navigate('shop')}
      >
        <span className="mob-nav-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5zM6 18v-4h6v4H6z" />
          </svg>
        </span>
        <span className="mob-nav-label">Shop</span>
      </a>

      <a
        className={`mob-nav-item ${route.page === 'cart' ? 'mob-nav-active' : ''}`}
        onClick={() => navigate('cart')}
      >
        <span className="mob-nav-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h2l2.2 11h10.6l2-7H7M9 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          </svg>
        </span>
        <span className="mob-nav-label">Cart</span>
      </a>

      <a
        className={`mob-nav-item ${route.page === 'track-order' ? 'mob-nav-active' : ''}`}
        onClick={() => navigate('track-order')}
      >
        <span className="mob-nav-icon" style={{ color: '#f59e0b' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12H7v-2h6v2zm3-4H7V8h9v2z" />
          </svg>
        </span>
        <span className="mob-nav-label" style={{ color: '#f59e0b' }}>
          Track
        </span>
      </a>
    </nav>
  )
}

import { useState, useEffect, useRef } from 'react'
import { LIVE_SALES_STREAM } from '../data/products'
import { useRouter } from '../context/RouterContext'

export default function LiveSaleToast() {
  const { navigate } = useRouter()
  const [currentSale, setCurrentSale] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const currentIndexRef = useRef(0)
  const dismissTimerRef = useRef(null)
  const isHoveredRef = useRef(false)

  const showSale = (sale) => {
    setCurrentSale(sale)
    setIsVisible(true)

    // Schedule auto-hide after 5.2 seconds
    clearTimeout(dismissTimerRef.current)
    dismissTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        hideSale()
      }
    }, 5200)
  }

  const hideSale = () => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentSale(null)
    }, 300)
  }

  // If hover ended and timer was already due, hide after a brief delay
  useEffect(() => {
    if (!isHovered && isVisible) {
      clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = setTimeout(() => {
        hideSale()
      }, 3500)
    }
  }, [isHovered, isVisible])

  useEffect(() => {
    if (dismissed) return

    // Initial first notification after 2.5 seconds
    const initialTimer = setTimeout(() => {
      showSale(LIVE_SALES_STREAM[0])
      currentIndexRef.current = 1
    }, 2500)

    // Periodic notifications every 11 seconds
    const interval = setInterval(() => {
      if (isHoveredRef.current) return

      const nextSale = LIVE_SALES_STREAM[currentIndexRef.current]
      currentIndexRef.current = (currentIndexRef.current + 1) % LIVE_SALES_STREAM.length
      showSale(nextSale)
    }, 11000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
      clearTimeout(dismissTimerRef.current)
    }
  }, [dismissed])

  if (dismissed || !currentSale) return null

  const handleClick = () => {
    if (currentSale.productId) {
      navigate('product/' + currentSale.productId)
    } else {
      navigate('shop')
    }
  }

  return (
    <aside
      id="live-sale"
      className={`live-sale-toast ${isVisible ? 'visible' : 'leaving'}`}
      role="status"
      aria-live="polite"
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true)
        isHoveredRef.current = true
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        isHoveredRef.current = false
      }}
      title="Click to view product"
    >
      {/* Product Image Thumbnail */}
      <div className="sale-toast-art">
        <img
          src={currentSale.image || '/posters/canva-pro.jpg'}
          alt={currentSale.product}
          className="sale-toast-img"
          loading="lazy"
        />
        <span className="sale-toast-live-badge" title="Live Verified Order">
          <span className="live-ping" />
          <span className="live-dot" />
        </span>
      </div>

      {/* Details Body */}
      <div className="sale-toast-content">
        <div className="sale-toast-meta">
          <span className="sale-toast-customer">
            <strong>{currentSale.customer}</strong>
            {currentSale.location ? ` in ${currentSale.location}` : ''}
          </span>
          <span className="sale-toast-time">{currentSale.time}</span>
        </div>

        <div className="sale-toast-product">
          {currentSale.product}
        </div>

        <div className="sale-toast-footer">
          <span className="sale-toast-price">৳ {currentSale.amount}</span>
          <span className="sale-toast-status">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            {currentSale.status || 'Instant Delivery'}
          </span>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        id="live-sale-close"
        className="sale-toast-close"
        aria-label="Dismiss sales notifications"
        onClick={(e) => {
          e.stopPropagation()
          setIsVisible(false)
          setTimeout(() => setDismissed(true), 250)
        }}
        title="Dismiss notifications"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="sale-toast-progress">
        <div className={`sale-toast-progress-bar ${isHovered ? 'paused' : ''}`} />
      </div>
    </aside>
  )
}

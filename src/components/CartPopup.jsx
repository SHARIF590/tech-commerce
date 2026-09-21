import { useCart } from '../context/CartContext'
import { useRouter } from '../context/RouterContext'
import ProductIcon from './ProductIcon'

export default function CartPopup() {
  const { isCartPopupOpen, setIsCartPopupOpen, lastAddedItem, setIsCheckoutOpen } = useCart()
  const { navigate } = useRouter()

  if (!isCartPopupOpen || !lastAddedItem) return null

  const handleCheckoutNow = () => {
    setIsCartPopupOpen(false)
    navigate('checkout')
  }

  const handleViewCart = () => {
    setIsCartPopupOpen(false)
    navigate('cart')
  }

  return (
    <>
      <div
        id="cartPopupOverlay"
        className="open"
        onClick={() => setIsCartPopupOpen(false)}
      />

      <div id="cartPopup" className="open">
        {/* Top Handle Bar */}
        <div style={{ width: 40, height: 4, background: '#e2e8f0', borderRadius: 4, margin: '12px auto 0' }} />

        {/* Success Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 28, height: 28, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              ✓
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#15803d' }}>
              Added to Cart!
            </span>
          </div>
          <button
            onClick={() => setIsCartPopupOpen(false)}
            style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', border: 'none', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Product Details Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px 14px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, background: '#f0f7ff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <ProductIcon type={lastAddedItem.iconType} image={lastAddedItem.image} fill size={32} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lastAddedItem.name}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {lastAddedItem.category}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>
              ৳ {lastAddedItem.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '14px 20px 20px' }}>
          <button
            onClick={handleViewCart}
            style={{
              padding: 12,
              borderRadius: 12,
              border: '2px solid #e2e8f0',
              background: '#fff',
              fontSize: 12,
              fontWeight: 700,
              color: '#374151',
              cursor: 'pointer',
              transition: '.18s',
            }}
          >
            View Basket
          </button>

          <button
            onClick={handleCheckoutNow}
            style={{
              padding: 12,
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #22b8f0)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: '.18s',
            }}
          >
            Checkout Now →
          </button>
        </div>
      </div>
    </>
  )
}

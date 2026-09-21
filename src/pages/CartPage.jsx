import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useRouter } from '../context/RouterContext'
import ProductIcon from '../components/ProductIcon'

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart, setIsCheckoutOpen } = useCart()
  const { navigate } = useRouter()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (coupon.trim().toUpperCase() === 'SHOPNO5') {
      const disc = Math.round((subtotal * 5) / 100)
      setDiscount(disc)
      setCouponMsg('Coupon applied! 5% discount deducted.')
    } else {
      setCouponMsg('Invalid coupon code. Try SHOPNO5')
    }
  }

  const finalTotal = Math.max(0, subtotal - discount)

  return (
    <div>
      <div className="page-head">
        <div className="shell">
          <span>SHOPPING BASKET</span>
          <h1>Your Cart</h1>
          <p>Review your selected digital software licenses and subscriptions.</p>
        </div>
      </div>

      <div className="shell" style={{ paddingTop: 36, paddingBottom: 64 }}>
        {items.length === 0 ? (
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid var(--line)',
              padding: 56,
              textAlign: 'center',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: 'var(--ink)' }}>
              Your basket is currently empty
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>
              Explore our best offers and add genuine software tools to your cart.
            </p>
            <button className="button primary" onClick={() => navigate('shop')}>
              Explore Shop
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
            {/* Items Table / List */}
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid var(--line)',
                padding: 24,
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--line)',
                  marginBottom: 16,
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>Product Details</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>Total</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      paddingBottom: 16,
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 10,
                          background: '#f8fafc',
                          border: '1px solid var(--line)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <ProductIcon type={item.iconType} image={item.image} fill size={28} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {item.category}
                        </div>
                        <h4 style={{ margin: '2px 0 6px', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                          {item.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                            ৳ {item.price.toLocaleString()} each
                          </span>
                          {/* Qty Box */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              border: '1px solid #cbd5e1',
                              borderRadius: 6,
                              overflow: 'hidden',
                              height: 26,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              style={{ width: 22, height: '100%', border: 'none', background: '#f8fafc', cursor: 'pointer', fontWeight: 700 }}
                            >
                              −
                            </button>
                            <span style={{ width: 24, textAlign: 'center', fontSize: 12, fontWeight: 700 }}>
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              style={{ width: 22, height: '100%', border: 'none', background: '#f8fafc', cursor: 'pointer', fontWeight: 700 }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <strong style={{ fontSize: 15, fontWeight: 800, color: 'var(--blue)' }}>
                        ৳ {(item.price * item.qty).toLocaleString()}
                      </strong>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <button
                  type="button"
                  onClick={clearCart}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear Cart
                </button>
                <a
                  onClick={() => navigate('shop')}
                  style={{ cursor: 'pointer', color: 'var(--blue)', fontSize: 12, fontWeight: 700 }}
                >
                  + Add More Products
                </a>
              </div>
            </div>

            {/* Order Summary Box */}
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid var(--line)',
                padding: 24,
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                height: 'fit-content',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>৳ {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                    <span>Promo Discount (5%)</span>
                    <span>-৳ {discount.toLocaleString()}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Digital Delivery</span>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>FREE (Instant)</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 16,
                    fontWeight: 800,
                    color: 'var(--ink)',
                    paddingTop: 12,
                    borderTop: '1px dashed var(--line)',
                  }}
                >
                  <span>Total Due</span>
                  <span style={{ color: '#1d4ed8' }}>৳ {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon form */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="Promo Code (SHOPNO5)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', fontSize: 12, outline: 'none' }}
                />
                <button type="submit" className="button ghost" style={{ minHeight: 34, padding: '0 12px', fontSize: 12, color: 'var(--ink)', borderColor: 'var(--line)' }}>
                  Apply
                </button>
              </form>
              {couponMsg && (
                <div style={{ fontSize: 11, color: discount > 0 ? '#16a34a' : '#ef4444', marginBottom: 16, fontWeight: 600 }}>
                  {couponMsg}
                </div>
              )}

              <button
                type="button"
                className="button primary"
                onClick={() => navigate('checkout')}
                style={{ width: '100%', minHeight: 46, fontSize: 14, fontWeight: 800 }}
              >
                Proceed to Checkout
              </button>

              <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--green)' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>100% Genuine Licenses with Replacement Warranty</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

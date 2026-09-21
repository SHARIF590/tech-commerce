import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { useRouter } from '../context/RouterContext'
import ProductIcon from '../components/ProductIcon'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { addOrder } = useProducts()
  const { navigate } = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    paymentMethod: 'bkash', // 'bkash' | 'nagad' | 'rocket' | 'bank'
    trxId: '',
    senderNumber: '',
  })

  const [orderComplete, setOrderComplete] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    const cleanName = form.name.trim()
    const cleanEmail = form.email.trim()
    const cleanPhone = form.phone.trim()

    if (!cleanName || !cleanEmail || !cleanPhone) {
      alert('Please fill in your name, email, and phone number for delivery.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      alert('Please enter a valid email address so we can send your license key and invoice.')
      return
    }

    if (form.paymentMethod !== 'bank' && !form.trxId.trim()) {
      alert(`Please enter your ${form.paymentMethod.toUpperCase()} Transaction ID (TrxID).`)
      return
    }

    const orderData = {
      orderId: 'SIT-' + Math.floor(100000 + Math.random() * 900000),
      customer: {
        ...form,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        trxId: form.trxId.trim(),
        senderNumber: form.senderNumber.trim(),
        notes: form.notes.trim().slice(0, 500),
      },
      items: [...items],
      total: finalTotal,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const created = addOrder(orderData)
    setPlacedOrder(created || orderData)
    setOrderComplete(true)
    clearCart()
  }

  if (orderComplete && placedOrder) {
    return (
      <div>
        <div className="page-head">
          <div className="shell">
            <span>ORDER CONFIRMATION</span>
            <h1>Order Placed Successfully</h1>
            <p>Your digital license keys and setup credentials are being provisioned.</p>
          </div>
        </div>

        <div className="shell" style={{ paddingTop: 36, paddingBottom: 64, maxWidth: 720 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              border: '1px solid var(--line)',
              padding: 40,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
                margin: '0 auto 20px',
              }}
            >
              ✓
            </div>

            <span
              style={{
                display: 'inline-block',
                background: '#eff6ff',
                color: 'var(--blue)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Order ID: {placedOrder.orderId}
            </span>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', margin: '0 0 10px' }}>
              Thank You, {placedOrder.customer.name}!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.6, maxWidth: 540, margin: '0 auto 24px' }}>
              We have received your order and payment verification request. Credentials and official invoice will be delivered to <strong>{placedOrder.customer.email}</strong> and via WhatsApp to <strong>{placedOrder.customer.phone}</strong> within 15–30 minutes.
            </p>

            <div
              style={{
                background: '#f8fafc',
                borderRadius: 14,
                border: '1px solid var(--line)',
                padding: 20,
                textAlign: 'left',
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
                Purchased Items ({placedOrder.items.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {placedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
                      {it.name} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>× {it.qty}</span>
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--ink)' }}>৳ {(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 15,
                    fontWeight: 800,
                    paddingTop: 10,
                    borderTop: '1px dashed var(--line)',
                    color: 'var(--blue)',
                  }}
                >
                  <span>Total Amount</span>
                  <span>৳ {placedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/8801738979790?text=${encodeURIComponent(`Hello Shopno IT, I just placed Order ${placedOrder.orderId} for BDT ${placedOrder.total}. TrxID: ${placedOrder.customer.trxId || 'N/A'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary"
                style={{ background: '#25D366', borderColor: '#25D366' }}
              >
                Send Order ID on WhatsApp
              </a>
              <button className="button ghost" onClick={() => navigate('track-order')}>
                Track This Order
              </button>
              <button className="button ghost" onClick={() => navigate('shop')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div>
        <div className="page-head">
          <div className="shell">
            <span>CHECKOUT</span>
            <h1>Instant Checkout</h1>
            <p>Your basket is currently empty.</p>
          </div>
        </div>

        <div className="shell" style={{ paddingTop: 48, paddingBottom: 64, textAlign: 'center' }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid var(--line)',
              padding: 48,
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', color: 'var(--ink)' }}>
              No items to checkout
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
              Add genuine software subscriptions or licenses from our catalog before checking out.
            </p>
            <button className="button primary" onClick={() => navigate('shop')}>
              Browse All Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-head">
        <div className="shell">
          <span>INSTANT DIGITAL DELIVERY</span>
          <h1>Complete Your Order</h1>
          <p>Pay securely via bKash, Nagad, or Rocket. Receive license keys directly on WhatsApp &amp; Email.</p>
        </div>
      </div>

      <div className="shell" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>
          <a onClick={() => navigate('home')} style={{ cursor: 'pointer', color: 'var(--blue)' }}>Home</a>
          <span>/</span>
          <a onClick={() => navigate('cart')} style={{ cursor: 'pointer', color: 'var(--blue)' }}>Cart</a>
          <span>/</span>
          <strong style={{ color: 'var(--ink)' }}>Checkout</strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
          {/* Left: Customer & Payment Form */}
          <form onSubmit={handlePlaceOrder}>
            {/* Step 1: Customer Details */}
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid var(--line)',
                padding: 28,
                marginBottom: 24,
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--navy)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  1
                </span>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--navy)' }}>
                  Delivery &amp; Contact Information
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={form.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--line)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--line)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                  Email Address (for License Key &amp; Invite) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                  Order Notes (Optional - e.g. Canva/ChatGPT account email if different)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Notes about your order or account credentials"
                  value={form.notes}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    fontSize: 13,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid var(--line)',
                padding: 28,
                marginBottom: 24,
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--navy)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  2
                </span>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--navy)' }}>
                  Select Payment Method
                </h3>
              </div>

              {/* Payment Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                <div
                  onClick={() => setForm((f) => ({ ...f, paymentMethod: 'bkash' }))}
                  style={{
                    border: form.paymentMethod === 'bkash' ? '2px solid #e2136e' : '1px solid var(--line)',
                    background: form.paymentMethod === 'bkash' ? '#fdf2f8' : '#fff',
                    padding: '14px 12px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#e2136e' }}>bKash</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Personal / Send Money</div>
                </div>

                <div
                  onClick={() => setForm((f) => ({ ...f, paymentMethod: 'nagad' }))}
                  style={{
                    border: form.paymentMethod === 'nagad' ? '2px solid #f97316' : '1px solid var(--line)',
                    background: form.paymentMethod === 'nagad' ? '#fff7ed' : '#fff',
                    padding: '14px 12px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#ea580c' }}>Nagad</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Send Money</div>
                </div>

                <div
                  onClick={() => setForm((f) => ({ ...f, paymentMethod: 'rocket' }))}
                  style={{
                    border: form.paymentMethod === 'rocket' ? '2px solid #8b5cf6' : '1px solid var(--line)',
                    background: form.paymentMethod === 'rocket' ? '#f5f3ff' : '#fff',
                    padding: '14px 12px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#7c3aed' }}>Rocket</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Personal</div>
                </div>
              </div>

              {/* Payment Instructions Box */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: 18,
                  fontSize: 13,
                  color: 'var(--ink)',
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>
                  Payment Instruction for {form.paymentMethod.toUpperCase()}:
                </div>
                <div>1. Go to your {form.paymentMethod.toUpperCase()} App or dial USSD.</div>
                <div>
                  2. Choose <strong>Send Money</strong> to Personal Account:{' '}
                  <strong style={{ color: 'var(--blue)', fontSize: 15 }}>01738-979790</strong>
                </div>
                <div>
                  3. Enter Exact Amount: <strong style={{ color: '#1d4ed8' }}>৳ {finalTotal.toLocaleString()}</strong>
                </div>
                <div>4. Copy the Transaction ID (TrxID) and enter it below.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Sender {form.paymentMethod.toUpperCase()} Number *
                  </label>
                  <input
                    type="tel"
                    name="senderNumber"
                    required
                    placeholder="01XXXXXXXXX"
                    value={form.senderNumber}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--line)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    name="trxId"
                    required
                    placeholder="e.g. 9J28KLA92M"
                    value={form.trxId}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--line)',
                      fontSize: 13,
                      textTransform: 'uppercase',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="button primary"
              style={{
                width: '100%',
                minHeight: 50,
                fontSize: 15,
                fontWeight: 800,
                borderRadius: 12,
              }}
            >
              Confirm Order (৳ {finalTotal.toLocaleString()})
            </button>
          </form>

          {/* Right: Order Summary */}
          <div>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid var(--line)',
                padding: 24,
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                position: 'sticky',
                top: 120,
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 280, overflowY: 'auto', marginBottom: 16, paddingRight: 4 }}>
                {items.map((it) => (
                  <div key={it.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f8fafc', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <ProductIcon type={it.iconType} image={it.image} fill size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                          {it.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                          Qty: {it.qty} × ৳ {it.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                      ৳ {(it.price * it.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="Promo Code (SHOPNO5)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--line)',
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="button ghost"
                  style={{ minHeight: 34, padding: '0 12px', fontSize: 12, color: 'var(--ink)', borderColor: 'var(--line)' }}
                >
                  Apply
                </button>
              </form>
              {couponMsg && (
                <div style={{ fontSize: 11, color: discount > 0 ? '#16a34a' : '#ef4444', marginBottom: 14, fontWeight: 600 }}>
                  {couponMsg}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, marginBottom: 16 }}>
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
                  <span>Total Payable</span>
                  <span style={{ color: 'var(--blue)' }}>৳ {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 11.5,
                  color: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--green)', flexShrink: 0 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Authorized retail keys with replacement warranty.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, items, subtotal, clearCart, updateQty, removeItem } = useCart()
  const { addOrder } = useProducts()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'bkash', // 'bkash' | 'nagad' | 'whatsapp'
    trxId: '',
  })

  const [orderComplete, setOrderComplete] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  if (!isCheckoutOpen) return null

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    const cleanName = form.name.trim()
    const cleanEmail = form.email.trim()
    const cleanPhone = form.phone.trim()

    if (!cleanName || !cleanEmail || !cleanPhone) {
      alert('Please fill in your name, email and phone number for delivery.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      alert('Please enter a valid email address so we can deliver your license.')
      return
    }

    if ((form.paymentMethod === 'bkash' || form.paymentMethod === 'nagad') && !form.trxId.trim()) {
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
        notes: form.notes.trim().slice(0, 500),
      },
      items: [...items],
      total: subtotal,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const created = addOrder(orderData)
    setPlacedOrder(created || orderData)
    setOrderComplete(true)
    clearCart()
  }

  const handleClose = () => {
    setIsCheckoutOpen(false)
    setOrderComplete(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          maxWidth: 780,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          padding: 28,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase' }}>
              Digital Eshop Checkout
            </div>
            <h2 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>
              {orderComplete ? 'Order Placed Successfully' : 'Instant Order & Delivery'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {orderComplete && placedOrder ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>
              ✓
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              Thank You, {placedOrder.customer.name}!
            </h3>
            <p style={{ color: '#64748b', fontSize: 14, maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.5 }}>
              Your order <strong style={{ color: 'var(--blue)' }}>#{placedOrder.orderId}</strong> has been registered. Our dispatch desk will send your software keys/invitation within 15–30 minutes via WhatsApp &amp; Email.
            </p>

            <div style={{ background: '#f8fafc', borderRadius: 14, padding: 18, maxWidth: 520, margin: '0 auto 24px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 8, textTransform: 'uppercase' }}>
                Delivery Summary
              </div>
              <div style={{ fontSize: 13, color: '#475569', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div><strong>Email:</strong> {placedOrder.customer.email}</div>
                <div><strong>WhatsApp:</strong> {placedOrder.customer.phone}</div>
                <div><strong>Method:</strong> {placedOrder.customer.paymentMethod.toUpperCase()} (TrxID: {placedOrder.customer.trxId})</div>
                <div><strong>Total Paid:</strong> ৳{placedOrder.total.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <a
                href={`https://wa.me/8801738979790?text=${encodeURIComponent(`Hello Shopno IT, I have placed Order ${placedOrder.orderId} for BDT ${placedOrder.total}. TrxID: ${placedOrder.customer.trxId || 'N/A'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  background: '#25d366',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Confirm on WhatsApp
              </a>
              <button
                className="button ghost"
                style={{ color: '#334155', borderColor: '#cbd5e1' }}
                onClick={handleClose}
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 16, color: '#64748b', marginBottom: 16 }}>Your cart is empty.</p>
            <button className="button primary" onClick={handleClose}>
              Explore Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
            {/* Form Column */}
            <form onSubmit={handlePlaceOrder}>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--navy)', marginBottom: 10 }}>
                1. Delivery Information
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 13, outline: 'none' }}
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="WhatsApp / Phone Number *"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 13, outline: 'none' }}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address (Keys sent here) *"
                  value={form.email}
                  onChange={handleChange}
                  style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--navy)', marginBottom: 10 }}>
                2. Select Payment Method
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: form.paymentMethod === 'bkash' ? '#eff6ff' : '#fff', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={form.paymentMethod === 'bkash'}
                    onChange={handleChange}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: 13 }}>bKash (Send Money / Payment)</strong>
                    <small style={{ color: '#64748b' }}>Number: 01738-979790</small>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: form.paymentMethod === 'nagad' ? '#eff6ff' : '#fff', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nagad"
                    checked={form.paymentMethod === 'nagad'}
                    onChange={handleChange}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: 13 }}>Nagad (Send Money)</strong>
                    <small style={{ color: '#64748b' }}>Number: 01738-979790</small>
                  </div>
                </label>
              </div>

              {(form.paymentMethod === 'bkash' || form.paymentMethod === 'nagad') && (
                <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#92400e', marginBottom: 4 }}>
                    Send ৳{subtotal.toLocaleString()} to: 01738-979790
                  </div>
                  <input
                    type="text"
                    name="trxId"
                    required
                    placeholder="Enter Transaction ID (TrxID) *"
                    value={form.trxId}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #f59e0b', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="button primary"
                style={{ width: '100%', minHeight: 46, fontSize: 14, fontWeight: 800 }}
              >
                Place Order Now (৳{subtotal.toLocaleString()})
              </button>
            </form>

            {/* Order Items Review Column */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--navy)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #e2e8f0' }}>
                Order Summary
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, maxHeight: 220, overflowY: 'auto' }}>
                {items.map((it) => (
                  <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'var(--navy)' }}>
                        {it.name.charAt(0)}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>
                          {it.name}
                        </div>
                        <div style={{ color: '#64748b' }}>Qty: {it.qty}</div>
                      </div>
                    </div>
                    <strong style={{ color: 'var(--blue)' }}>৳{(it.price * it.qty).toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                  <span>Digital Delivery</span>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>FREE (Instant)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: 'var(--navy)' }}>
                  <span>Total Amount</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

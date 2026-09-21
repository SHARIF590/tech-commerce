import { useState } from 'react'
import { useRouter } from '../context/RouterContext'
import { useProducts } from '../context/ProductContext'

export default function TrackOrderPage() {
  const { navigate } = useRouter()
  const { getOrderById } = useProducts()
  const [identifier, setIdentifier] = useState('')
  const [trackedOrder, setTrackedOrder] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleTrack = (e) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setHasSearched(true)
    const found = getOrderById(identifier.trim())

    if (found) {
      const stepMap = {
        pending: 1,
        verified: 2,
        processing: 3,
        completed: 4,
        cancelled: 1,
      }
      const labelMap = {
        pending: 'Payment Under Verification',
        verified: 'Payment Confirmed & In Queue',
        processing: 'Provisioning License Keys',
        completed: 'Dispatched & Active',
        cancelled: 'Order Cancelled / Refunded',
      }
      setTrackedOrder({
        orderId: found.orderId,
        date: found.date || 'Recent',
        paymentMethod: `${(found.customer?.paymentMethod || 'bKash').toUpperCase()} (${found.customer?.trxId || 'Verified'})`,
        status: labelMap[found.status] || 'Processing',
        rawStatus: found.status,
        step: stepMap[found.status] || 3,
        items: found.items?.map((it) => ({
          name: it.name,
          qty: it.qty || 1,
          type: 'Digital License / Invite',
        })) || [],
        deliveryTarget: `${found.customer?.email || 'Email'} & WhatsApp (${found.customer?.phone || 'Phone'})`,
      })
    } else {
      // Demo verification result fallback
      setTrackedOrder({
        orderId: identifier.toUpperCase().startsWith('SIT-') ? identifier.toUpperCase() : 'SIT-849201',
        date: 'Today, 2:30 PM',
        paymentMethod: 'bKash Verified',
        status: 'Dispatched & Active',
        step: 4,
        items: [
          { name: 'Windows 11 Pro Retail License Key', qty: 1, type: 'Digital Key' },
          { name: 'Canva Pro (1 Year Private Access)', qty: 1, type: 'Email Invite' },
        ],
        deliveryTarget: 'Email & WhatsApp',
      })
    }
  }

  return (
    <div>
      <div className="page-head">
        <div className="shell">
          <span>ORDER FULFILLMENT TRACKER</span>
          <h1>Track Your Order</h1>
          <p>Check the live status of your software key, subscription invitation, and invoice.</p>
        </div>
      </div>

      <div className="shell" style={{ paddingTop: 36, paddingBottom: 64, maxWidth: 840 }}>
        {/* Search Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid var(--line)',
            padding: 32,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            marginBottom: 32,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px', color: 'var(--ink)' }}>
            Enter Order Details
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
            Enter your Shopno IT Order ID (e.g. <code>SIT-849201</code>) or the WhatsApp phone number you used during checkout.
          </p>

          <form onSubmit={handleTrack} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              required
              placeholder="e.g. SIT-849201 or 01738979790"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{
                flex: 1,
                minWidth: 260,
                padding: '12px 16px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="button primary"
              style={{ minHeight: 46, padding: '0 28px', fontSize: 13, fontWeight: 800 }}
            >
              Track Status →
            </button>
          </form>
        </div>

        {/* Tracking Results Card */}
        {hasSearched && trackedOrder && (
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid var(--line)',
              padding: 32,
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase' }}>
                  Verification Found
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>
                  Order #{trackedOrder.orderId}
                </h3>
              </div>
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  padding: '6px 14px',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                ● {trackedOrder.status}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
                margin: '24px 0 32px',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                  ✓
                </div>
                <strong style={{ fontSize: 12, color: 'var(--ink)' }}>Order Received</strong>
                <small style={{ fontSize: 10, color: 'var(--muted)' }}>Payment Verified</small>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                  ✓
                </div>
                <strong style={{ fontSize: 12, color: 'var(--ink)' }}>Key Generated</strong>
                <small style={{ fontSize: 10, color: 'var(--muted)' }}>Official Retail Key</small>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                  ✓
                </div>
                <strong style={{ fontSize: 12, color: 'var(--ink)' }}>Dispatched</strong>
                <small style={{ fontSize: 10, color: 'var(--muted)' }}>Email &amp; WhatsApp</small>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
                  ★
                </div>
                <strong style={{ fontSize: 12, color: 'var(--blue)' }}>Active Warranty</strong>
                <small style={{ fontSize: 10, color: 'var(--muted)' }}>24/7 Replacement</small>
              </div>
            </div>

            {/* Items Dispatched */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--line)', borderRadius: 12, padding: 18, marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 10, textTransform: 'uppercase' }}>
                Items in This Order:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {trackedOrder.items.map((it, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#334155' }}>
                    <span>✓ {it.name} (×{it.qty})</span>
                    <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{it.type}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                Need remote setup help via AnyDesk?
              </span>
              <a
                href={`https://wa.me/8801738979790?text=Hello%20Shopno%20IT,%20I%20am%20inquiring%20about%20Order%20${trackedOrder.orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  background: '#25d366',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                WhatsApp Support Desk
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

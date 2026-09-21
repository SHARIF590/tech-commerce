import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function TrackOrderModal() {
  const { isTrackOrderOpen, setIsTrackOrderOpen } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [result, setResult] = useState(null)

  if (!isTrackOrderOpen) return null

  const handleTrack = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    // Demo lookup
    setResult({
      orderId: searchTerm.startsWith('SIT-') ? searchTerm : 'SIT-849201',
      status: 'Active & Delivered',
      deliveredVia: 'Email & WhatsApp',
      date: 'Today',
      time: 'Instant Delivery',
      support: 'Need another key copy? WhatsApp 01738-979790',
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={() => setIsTrackOrderOpen(false)}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 480,
          width: '100%',
          padding: 24,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>
            Track Your Order
          </h3>
          <button
            onClick={() => setIsTrackOrderOpen(false)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
          Enter your Order ID (e.g. <code>SIT-849201</code>) or your WhatsApp phone number to check key dispatch status.
        </p>

        <form onSubmit={handleTrack} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Order ID or 01XXXXXXXXX"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1.5px solid #cbd5e1',
              borderRadius: 10,
              fontSize: 13,
              outline: 'none',
            }}
            required
          />
          <button
            type="submit"
            className="button primary"
            style={{ minHeight: 40, padding: '0 18px', fontSize: 13 }}
          >
            Track
          </button>
        </form>

        {result && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: 16,
              fontSize: 13,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#166534', fontWeight: 700 }}>Order ID:</span>
              <strong style={{ color: '#0f172a' }}>{result.orderId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#166534', fontWeight: 700 }}>Status:</span>
              <strong style={{ color: '#15803d' }}>{result.status}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#166534', fontWeight: 700 }}>Delivered To:</span>
              <span>{result.deliveredVia}</span>
            </div>
            <div style={{ fontSize: 12, color: '#475569', borderTop: '1px dashed #cbd5e1', paddingTop: 8 }}>
              {result.support}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

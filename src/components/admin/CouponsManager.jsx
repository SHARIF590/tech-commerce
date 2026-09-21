import { useState } from 'react'
import { Plus, Trash2, Percent } from 'lucide-react'

export default function CouponsManager({
  coupons = [],
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
}) {
  const [code, setCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState('5')
  const [description, setDescription] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!code.trim()) return
    onAddCoupon({
      code: code.trim(),
      discountPercent: Number(discountPercent) || 5,
      description: description.trim() || 'Promotional coupon code',
    })
    setCode('')
    setDescription('')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
      {/* Coupons List */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 24,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Active Coupons &amp; Promo Codes ({coupons.length})
            </h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
              Discounts redeemable by customers during checkout
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {coupons.map((cpn) => (
            <div
              key={cpn.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 12,
                background: cpn.active ? '#f8fafc' : '#f1f5f9',
                border: cpn.active ? '1px solid #e2e8f0' : '1px dashed #cbd5e1',
                opacity: cpn.active ? 1 : 0.65,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: cpn.active ? '#eff6ff' : '#e2e8f0',
                    color: cpn.active ? '#2563eb' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  <Percent size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <code
                      style={{
                        background: '#1e293b',
                        color: '#f8fafc',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {cpn.code}
                    </code>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#16a34a' }}>
                      {cpn.discountPercent}% OFF
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                    {cpn.description} • Redeemed <strong>{cpn.usageCount || 0}</strong> times
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Active Toggle Button */}
                <button
                  onClick={() => onToggleCoupon(cpn.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 99,
                    border: 'none',
                    background: cpn.active ? '#dcfce7' : '#fee2e2',
                    color: cpn.active ? '#15803d' : '#b91c1c',
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ● {cpn.active ? 'Active' : 'Disabled'}
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm(`Delete coupon "${cpn.code}"?`)) {
                      onDeleteCoupon(cpn.id)
                    }
                  }}
                  style={{
                    background: '#fff5f5',
                    border: '1px solid #fecaca',
                    color: '#ef4444',
                    padding: '6px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                  title="Delete coupon"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Coupon Form */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 24,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          height: 'fit-content',
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          + Create New Coupon
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
          Distribute codes for seasonal discounts or customer campaigns.
        </p>

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Coupon Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SHOPNO10"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.05em',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Discount Percentage (%) *
            </label>
            <input
              type="number"
              required
              min="1"
              max="90"
              placeholder="10"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Description Note
            </label>
            <input
              type="text"
              placeholder="e.g. Special Holiday Promo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '11px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>Publish Coupon Code</span>
          </button>
        </form>
      </div>
    </div>
  )
}

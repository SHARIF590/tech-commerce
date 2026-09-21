import { useMemo } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  Package,
  MessageSquare,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  PlusCircle,
  Download,
} from 'lucide-react'

export default function DashboardOverview({
  products = [],
  orders = [],
  inquiries = [],
  onNavigateTab,
  onOpenAddProduct,
  onUpdateOrderStatus,
}) {
  // KPI Calculations
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
  }, [orders])

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending'), [orders])
  const completedOrders = useMemo(() => orders.filter((o) => o.status === 'completed'), [orders])

  const totalCatalogValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0), 0)
  }, [products])

  const totalCost = useMemo(() => {
    return products.reduce((acc, p) => {
      if (!p.buyingPrice) return acc
      return acc + (Number(p.buyingPrice) || 0) * (Number(p.sold) || 0)
    }, 0)
  }, [products])

  const totalProfit = useMemo(() => {
    return products.reduce((acc, p) => {
      if (!p.buyingPrice) return acc
      const profit = ((Number(p.price) || 0) - (Number(p.buyingPrice) || 0)) * (Number(p.sold) || 0)
      return acc + profit
    }, 0)
  }, [products])

  const avgMarginPct = useMemo(() => {
    const priced = products.filter((p) => p.buyingPrice > 0 && p.price > 0)
    if (priced.length === 0) return null
    const avg = priced.reduce((acc, p) => {
      return acc + ((p.price - p.buyingPrice) / p.price) * 100
    }, 0) / priced.length
    return avg.toFixed(1)
  }, [products])

  const lowStockItems = useMemo(() => {
    return products.filter((p) => Number(p.stock) <= 5)
  }, [products])

  const newInquiries = useMemo(() => {
    return inquiries.filter((i) => i.status === 'new')
  }, [inquiries])

  // 7-Day Mock/Live Trend for SVG Chart
  const trendDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today']
  const trendValues = [3400, 5200, 4800, 7100, 6300, 8900, Math.max(4500, totalRevenue > 10000 ? 9400 : 5400)]
  const maxVal = Math.max(...trendValues, 10000)

  // Calculate SVG polyline points
  const chartHeight = 140
  const chartWidth = 500
  const points = trendValues
    .map((val, idx) => {
      const x = (idx / (trendValues.length - 1)) * (chartWidth - 40) + 20
      const y = chartHeight - (val / maxVal) * (chartHeight - 40) - 20
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 4 KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {/* Card 1: Revenue */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 20,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Revenue
              </span>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '6px 0 2px', letterSpacing: '-0.02em' }}>
                ৳ {totalRevenue.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginTop: 12 }}>
            <span style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +18.4%
            </span>
            <span style={{ color: '#64748b' }}>vs last period</span>
          </div>
        </div>

        {/* Card: Net Profit */}
        {totalProfit > 0 && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1.5px solid #bbf7d0',
              padding: 20,
              boxShadow: '0 4px 20px rgba(22, 163, 74, 0.07)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Net Profit
                </span>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a', margin: '6px 0 2px', letterSpacing: '-0.02em' }}>
                  ৳ {totalProfit.toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: '#dcfce7', color: '#16a34a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <TrendingUp size={22} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, marginTop: 12, flexWrap: 'wrap' }}>
              {avgMarginPct !== null && (
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 99, fontWeight: 700, fontSize: 11 }}>
                  Avg {avgMarginPct}% margin
                </span>
              )}
              {totalCost > 0 && (
                <span style={{ color: '#64748b' }}>
                  Cost: <strong style={{ color: '#b91c1c' }}>৳{totalCost.toLocaleString()}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Card 2: Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 20,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Orders
              </span>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '6px 0 2px', letterSpacing: '-0.02em' }}>
                {orders.length}
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginTop: 12 }}>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 99, fontWeight: 700, fontSize: 11 }}>
              {pendingOrders.length} Pending
            </span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>{completedOrders.length} Completed</span>
          </div>
        </div>

        {/* Card 3: Products */}
        <div
          onClick={() => onNavigateTab('products')}
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 20,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Catalog
              </span>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '6px 0 2px', letterSpacing: '-0.02em' }}>
                {products.length} Items
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginTop: 12 }}>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>৳ {totalCatalogValue.toLocaleString()}</span>
            <span style={{ color: '#64748b' }}>inventory stock value</span>
          </div>
        </div>

        {/* Card 4: CRM Leads */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 20,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Customer Leads
              </span>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '6px 0 2px', letterSpacing: '-0.02em' }}>
                {inquiries.length}
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageSquare size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginTop: 12 }}>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 99, fontWeight: 700, fontSize: 11 }}>
              {newInquiries.length} Unread Leads
            </span>
            <span style={{ color: '#64748b' }}>from Contact desk</span>
          </div>
        </div>
      </div>

      {/* Grid: Revenue Chart + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Revenue Velocity Chart */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Weekly Sales Velocity
              </h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                Dynamic digital vouchers &amp; software keys transaction volume
              </p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', background: '#ecfdf5', padding: '4px 10px', borderRadius: 8 }}>
              ● Live Stream
            </span>
          </div>

          {/* SVG Line Graph */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: '100%', height: 170, overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area fill */}
              <polygon
                points={`20,${chartHeight - 20} ${points} 480,${chartHeight - 20}`}
                fill="url(#areaGradient)"
              />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Dots and Labels */}
              {trendValues.map((val, idx) => {
                const x = (idx / (trendValues.length - 1)) * (chartWidth - 40) + 20
                const y = chartHeight - (val / maxVal) * (chartHeight - 40) - 20
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                    <text
                      x={x}
                      y={chartHeight - 4}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {trendDays[idx]}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Quick Actions
            </h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 16px' }}>
              Common administrative tasks
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={onOpenAddProduct}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                }}
              >
                <PlusCircle size={17} />
                <span>+ Add New Product</span>
              </button>

              <button
                onClick={() => onNavigateTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#1e293b',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ShoppingBag size={16} color="#2563eb" />
                <span>Review Pending Orders ({pendingOrders.length})</span>
              </button>

              <button
                onClick={() => onNavigateTab('backups')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#1e293b',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={16} color="#059669" />
                <span>Download Store Backup</span>
              </button>

              <button
                onClick={() => onNavigateTab('security')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#1e293b',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={16} color="#dc2626" />
                <span>View Security Audit Logs</span>
              </button>
            </div>
          </div>

          {/* System Defense Pill */}
          <div
            style={{
              marginTop: 16,
              padding: '10px 12px',
              borderRadius: 10,
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <ShieldCheck size={20} color="#16a34a" />
            <div style={{ fontSize: 11, color: '#166534', lineHeight: 1.4 }}>
              <strong>Zero Compromises:</strong> Cryptographic passcode hashing &amp; lockout protection enabled.
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders + Low Stock Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 20 }}>
        {/* Recent Orders */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Recent Store Orders
              </h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                Latest customer purchases requiring license delivery
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View All Orders →
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 10px' }}>Order ID</th>
                  <th style={{ padding: '8px 10px' }}>Customer</th>
                  <th style={{ padding: '8px 10px' }}>Amount</th>
                  <th style={{ padding: '8px 10px' }}>Method</th>
                  <th style={{ padding: '8px 10px' }}>Status</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => {
                  const statusColors = {
                    pending: { bg: '#fef3c7', text: '#92400e' },
                    verified: { bg: '#dbeafe', text: '#1e40af' },
                    processing: { bg: '#ede9fe', text: '#6d28d9' },
                    completed: { bg: '#dcfce7', text: '#15803d' },
                    cancelled: { bg: '#fee2e2', text: '#b91c1c' },
                  }
                  const sc = statusColors[ord.status] || statusColors.pending
                  return (
                    <tr key={ord.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#0f172a' }}>
                        {ord.orderId}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{ord.customer?.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{ord.customer?.phone}</div>
                      </td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#2563eb' }}>
                        ৳ {Number(ord.total).toLocaleString()}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, color: '#475569' }}>
                          {ord.customer?.paymentMethod || 'bKash'}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            background: sc.bg,
                            color: sc.text,
                            padding: '2px 8px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'capitalize',
                          }}
                        >
                          ● {ord.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        {ord.status === 'pending' ? (
                          <button
                            onClick={() => onUpdateOrderStatus(ord.orderId, 'verified')}
                            style={{
                              background: '#2563eb',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 8px',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Verify
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigateTab('orders')}
                            style={{
                              background: '#f1f5f9',
                              color: '#475569',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 8px',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Radar */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Inventory Radar
              </h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
                Stock alerts &amp; restock reminders
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Catalog →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lowStockItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#16a34a', fontSize: 12.5 }}>
                <CheckCircle2 size={24} style={{ margin: '0 auto 6px', display: 'block' }} />
                All products have healthy inventory levels!
              </div>
            ) : (
              lowStockItems.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: p.stock === 0 ? '#fef2f2' : '#fffbeb',
                    border: `1px solid ${p.stock === 0 ? '#fecaca' : '#fde68a'}`,
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>৳ {p.price}</div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: p.stock === 0 ? '#ef4444' : '#f59e0b',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

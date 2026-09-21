import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Search,
  RefreshCw,
  Plus,
  BarChart3,
  History,
  Download,
  X,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Filter,
} from 'lucide-react'

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

// ─── Movement Types ────────────────────────────────────────────────────────────
const MOVEMENT_TYPES = {
  RESTOCK:    { label: 'Restock',    color: '#16a34a', bg: '#dcfce7', icon: '+' },
  SALE:       { label: 'Sale',       color: '#2563eb', bg: '#dbeafe', icon: '−' },
  ADJUSTMENT: { label: 'Adjustment', color: '#f59e0b', bg: '#fef3c7', icon: '±' },
  VOID:       { label: 'Voided',     color: '#8b5cf6', bg: '#ede9fe', icon: '↩' },
  WRITE_OFF:  { label: 'Write-Off',  color: '#ef4444', bg: '#fee2e2', icon: '✕' },
}

// ─── Stock badge helper ───────────────────────────────────────────────────────
function getStockBadge(stock) {
  if (stock === 0)   return { label: 'OUT',      color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' }
  if (stock <= 5)    return { label: '🚨 CRITICAL', color: '#92400e', bg: '#fef3c7', border: '#fde68a' }
  if (stock <= 15)   return { label: '⚠️ LOW',   color: '#c2410c', bg: '#fff7ed', border: '#fed7aa' }
  return               { label: '✅ OK',     color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' }
}

// ─── Restock Modal ────────────────────────────────────────────────────────────
function RestockModal({ product, onConfirm, onClose }) {
  const [qty, setQty]   = useState('')
  const [type, setType] = useState('RESTOCK')
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsed = parseInt(qty, 10)
    if (!parsed || parsed === 0) return
    onConfirm({ productId: product.id, productName: product.name, qty: parsed, type, note })
    onClose()
  }

  const isNeg        = type === 'WRITE_OFF' || type === 'SALE'
  const parsedQty    = Math.abs(parseInt(qty) || 0)
  const resultStock  = product.stock + (isNeg ? -parsedQty : parsedQty)

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(6px)', zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440,
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)', padding: '24px 22px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, background: '#f1f5f9',
            border: 'none', borderRadius: '50%', width: 30, height: 30,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={15} color="#64748b" />
        </button>

        <span style={{ fontSize: 10, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Stock Movement
        </span>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '4px 0 2px', lineHeight: 1.3 }}>
          {product.name}
        </h2>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 18 }}>
          Current Stock: <strong style={{ color: product.stock <= 5 ? '#ef4444' : '#16a34a' }}>
            {product.stock} units
          </strong>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>
              Movement Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 10,
                border: '1px solid #cbd5e1', fontSize: 13, fontWeight: 600,
                background: MOVEMENT_TYPES[type]?.bg, color: MOVEMENT_TYPES[type]?.color,
                outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
              }}
            >
              {Object.entries(MOVEMENT_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>
              Quantity
            </label>
            <input
              type="number" value={qty} onChange={(e) => setQty(e.target.value)}
              min="1" placeholder="e.g. 50" required
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 10,
                border: '1px solid #cbd5e1', fontSize: 16, fontWeight: 800,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>
              Note (optional)
            </label>
            <input
              type="text" value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Received from supplier"
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 10,
                border: '1px solid #cbd5e1', fontSize: 13, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {qty && (
            <div style={{
              background: resultStock < 0 ? '#fee2e2' : '#f0fdf4',
              border: `1px solid ${resultStock < 0 ? '#fecaca' : '#bbf7d0'}`,
              borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {resultStock < 0
                ? <XCircle size={16} color="#ef4444" />
                : <CheckCircle2 size={16} color="#16a34a" />
              }
              <span style={{ fontSize: 13 }}>
                <span style={{ color: '#475569' }}>New stock: </span>
                <strong style={{ color: resultStock < 0 ? '#ef4444' : '#0f172a', fontSize: 16 }}>
                  {Math.max(0, resultStock)}
                </strong>
                {resultStock < 0 && <span style={{ color: '#ef4444', marginLeft: 5, fontSize: 11 }}>(min 0)</span>}
              </span>
            </div>
          )}

          <button
            type="submit"
            style={{
              background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px 0', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginTop: 2,
            }}
          >
            Apply Movement
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Product Card (mobile) ────────────────────────────────────────────────────
function ProductCard({ product, movements, onRestock, expanded, onToggleExpand }) {
  const badge         = getStockBadge(Number(product.stock))
  const productMoves  = movements.filter((m) => m.productId === product.id)
  const stockPct      = Math.min(100, Math.round(
    (product.stock / Math.max(product.stock + product.sold, 1)) * 100
  ))

  return (
    <div style={{
      background: product.stock === 0 ? '#fff5f5' : product.stock <= 5 ? '#fffbeb' : '#fff',
      border: product.stock <= 5 ? `1.5px solid ${badge.border}` : '1px solid #e2e8f0',
      borderRadius: 14, padding: 16,
      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
    }}>
      {/* Row 1: Name + Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 14, lineHeight: 1.35 }}>
            {product.name}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            {product.category}
          </div>
        </div>
        <span style={{
          background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
          borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {badge.label}
        </span>
      </div>

      {/* Stock bar */}
      <div style={{ height: 4, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{
          height: '100%', width: `${stockPct}%`, borderRadius: 4,
          background: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '#22c55e',
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Row 2: Metrics grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8, marginBottom: 12,
      }}>
        <div style={{ textAlign: 'center', background: '#f8fafc', borderRadius: 8, padding: '8px 4px' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: badge.color, lineHeight: 1 }}>
            {product.stock}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>IN STOCK</div>
        </div>
        <div style={{ textAlign: 'center', background: '#f8fafc', borderRadius: 8, padding: '8px 4px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>
            {product.sold || 0}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>SOLD</div>
        </div>
        <div style={{ textAlign: 'center', background: '#f8fafc', borderRadius: 8, padding: '8px 4px' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1d4ed8', lineHeight: 1 }}>
            ৳{Number(product.price).toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>PRICE</div>
        </div>
      </div>

      {/* Row 3: Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onRestock(product)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} />
          Update Stock
        </button>
        <button
          onClick={onToggleExpand}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#f8fafc', color: '#475569',
            border: '1px solid #e2e8f0', borderRadius: 10,
            padding: '10px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {productMoves.length > 0 && (
            <span style={{
              background: '#7c3aed', color: '#fff',
              borderRadius: 99, fontSize: 9, padding: '1px 5px', fontWeight: 800,
            }}>
              {productMoves.length}
            </span>
          )}
        </button>
      </div>

      {/* Expanded history */}
      {expanded && (
        <div style={{ marginTop: 12, borderTop: '1px dashed #e2e8f0', paddingTop: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
            Movement History
          </div>
          {productMoves.length === 0 ? (
            <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
              No movements yet.
            </div>
          ) : (
            productMoves.slice(0, 5).map((mv) => {
              const mt = MOVEMENT_TYPES[mv.type] || MOVEMENT_TYPES.ADJUSTMENT
              return (
                <div key={mv.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0',
                  padding: '7px 10px', marginBottom: 5,
                }}>
                  <span style={{
                    background: mt.bg, color: mt.color, borderRadius: 6,
                    padding: '2px 7px', fontSize: 11, fontWeight: 800, flexShrink: 0,
                  }}>
                    {mt.icon}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: mv.qty > 0 ? '#16a34a' : '#dc2626' }}>
                    {mv.qty > 0 ? '+' : ''}{mv.qty}
                  </span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    {mv.stockBefore}→{mv.stockAfter}
                  </span>
                  {mv.note && (
                    <span style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {mv.note}
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: '#cbd5e1', flexShrink: 0 }}>
                    {new Date(mv.timestamp).toLocaleDateString()}
                  </span>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

// ─── Desktop Table Row ────────────────────────────────────────────────────────
function ProductTableRow({ product, movements, onRestock, expanded, onToggleExpand }) {
  const badge        = getStockBadge(Number(product.stock))
  const productMoves = movements.filter((m) => m.productId === product.id)
  const stockPct     = Math.min(100, Math.round(
    (product.stock / Math.max(product.stock + product.sold, 1)) * 100
  ))

  return (
    <>
      <tr style={{
        borderBottom: expanded ? 'none' : '1px solid #f1f5f9',
        background: product.stock === 0 ? '#fff5f5' : product.stock <= 5 ? '#fffbeb' : '#fff',
        transition: 'background 0.2s',
      }}>
        {/* Product */}
        <td style={{ padding: '13px 16px' }}>
          <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 13, lineHeight: 1.35 }}>
            {product.name}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            {product.category} · {product.id}
          </div>
          <div style={{ marginTop: 6, height: 3, width: 100, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${stockPct}%`,
              background: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '#22c55e',
              borderRadius: 4, transition: 'width 0.4s',
            }} />
          </div>
        </td>

        {/* Stock */}
        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: badge.color }}>{product.stock}</span>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>units</div>
        </td>

        {/* Status */}
        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
          <span style={{
            background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
            borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 800,
          }}>
            {badge.label}
          </span>
        </td>

        {/* Sold */}
        <td style={{ padding: '13px 16px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <TrendingUp size={13} color="#16a34a" />
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{product.sold || 0}</span>
          </div>
        </td>

        {/* Price / Value */}
        <td style={{ padding: '13px 16px', textAlign: 'right' }}>
          <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: 14 }}>
            ৳ {Number(product.price).toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
            ৳ {(product.price * product.stock).toLocaleString()}
          </div>
        </td>

        {/* Actions */}
        <td style={{ padding: '13px 16px' }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <button
              onClick={() => onRestock(product)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: '#eff6ff', color: '#1d4ed8',
                border: '1px solid #bfdbfe', borderRadius: 8,
                padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <RefreshCw size={12} /> Update
            </button>
            <button
              onClick={onToggleExpand}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: '#f8fafc', color: '#475569',
                border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '6px 8px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {productMoves.length > 0 && (
                <span style={{
                  background: '#7c3aed', color: '#fff',
                  borderRadius: 99, fontSize: 9, padding: '1px 5px', fontWeight: 800,
                }}>
                  {productMoves.length}
                </span>
              )}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded history row */}
      {expanded && (
        <tr key={`${product.id}-exp`} style={{ borderBottom: '1px solid #f1f5f9' }}>
          <td colSpan={6} style={{ padding: '0 16px 14px' }}>
            <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Movement History
              </div>
              {productMoves.length === 0 ? (
                <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                  No movements logged yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {productMoves.slice(0, 5).map((mv) => {
                    const mt = MOVEMENT_TYPES[mv.type] || MOVEMENT_TYPES.ADJUSTMENT
                    return (
                      <div key={mv.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0',
                        padding: '7px 12px',
                      }}>
                        <span style={{
                          background: mt.bg, color: mt.color, borderRadius: 6,
                          padding: '2px 8px', fontSize: 11, fontWeight: 800, flexShrink: 0,
                        }}>
                          {mt.icon} {mt.label}
                        </span>
                        <span style={{ color: mv.qty > 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                          {mv.qty > 0 ? '+' : ''}{mv.qty}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>
                          {mv.stockBefore} → {mv.stockAfter}
                        </span>
                        {mv.note && (
                          <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: 12 }}>
                            "{mv.note}"
                          </span>
                        )}
                        <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 11 }}>
                          {new Date(mv.timestamp).toLocaleString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ─── Main InventoryManager ────────────────────────────────────────────────────
export default function InventoryManager({ products = [], orders = [], onUpdateProduct, onLogAuditEvent }) {
  const winWidth = useWindowWidth()
  const isMobile = winWidth < 768
  const isTablet = winWidth >= 768 && winWidth < 1100

  const [searchTerm,     setSearchTerm]     = useState('')
  const [stockFilter,    setStockFilter]    = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy,         setSortBy]         = useState('stock_asc')
  const [showFilters,    setShowFilters]    = useState(false)
  const [restockTarget,  setRestockTarget]  = useState(null)
  const [expandedId,     setExpandedId]     = useState(null)
  const [showMovLog,     setShowMovLog]     = useState(false)

  const [movements, setMovements] = useState(() => {
    try {
      const saved = localStorage.getItem('shopno_it_inventory_movements_v1')
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return []
  })

  const persistMovements = useCallback((m) => {
    setMovements(m)
    try { localStorage.setItem('shopno_it_inventory_movements_v1', JSON.stringify(m)) } catch { /* ignore */ }
  }, [])

  const applyMovement = useCallback(({ productId, productName, qty, type, note }) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    const isNeg     = type === 'WRITE_OFF' || type === 'SALE'
    const delta     = isNeg ? -Math.abs(qty) : Math.abs(qty)
    const newStock  = Math.max(0, product.stock + delta)

    const mv = {
      id: `mv-${Date.now()}`, productId, productName, type,
      qty: delta, stockBefore: product.stock, stockAfter: newStock,
      note: note || '', operator: 'Admin', timestamp: new Date().toISOString(),
    }

    persistMovements([mv, ...movements])
    onUpdateProduct(productId, { stock: newStock })
    onLogAuditEvent?.('INVENTORY_MOVEMENT', `"${productName}": ${product.stock}→${newStock} (${MOVEMENT_TYPES[type]?.label})`)
  }, [products, movements, persistMovements, onUpdateProduct, onLogAuditEvent])

  // KPIs
  const kpi = useMemo(() => {
    const totalUnits       = products.reduce((a, p) => a + (Number(p.stock) || 0), 0)
    const totalSold        = products.reduce((a, p) => a + (Number(p.sold) || 0), 0)
    const outOfStock       = products.filter((p) => Number(p.stock) === 0)
    const critical         = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5)
    const low              = products.filter((p) => Number(p.stock) > 5 && Number(p.stock) <= 15)
    const totalCatalogValue = products.reduce((a, p) => a + (Number(p.price) || 0) * (Number(p.stock) || 0), 0)
    return { totalUnits, totalSold, outOfStock, critical, low, totalCatalogValue }
  }, [products])

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products])

  const filtered = useMemo(() => {
    let r = [...products]
    if (categoryFilter !== 'all') r = r.filter((p) => p.category === categoryFilter)
    if (stockFilter === 'out')      r = r.filter((p) => Number(p.stock) === 0)
    else if (stockFilter === 'critical') r = r.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5)
    else if (stockFilter === 'low')  r = r.filter((p) => Number(p.stock) > 5 && Number(p.stock) <= 15)
    else if (stockFilter === 'ok')   r = r.filter((p) => Number(p.stock) > 15)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      r = r.filter((p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q))
    }
    r.sort((a, b) => {
      if (sortBy === 'stock_asc')  return (Number(a.stock) || 0) - (Number(b.stock) || 0)
      if (sortBy === 'stock_desc') return (Number(b.stock) || 0) - (Number(a.stock) || 0)
      if (sortBy === 'sold')       return (Number(b.sold) || 0) - (Number(a.sold) || 0)
      if (sortBy === 'name')       return (a.name || '').localeCompare(b.name || '')
      return 0
    })
    return r
  }, [products, categoryFilter, stockFilter, searchTerm, sortBy])

  const exportCsv = () => {
    const header = 'Name,Category,Stock,Sold,Price,Value,Status'
    const rows = products.map((p) => {
      const st = p.stock === 0 ? 'OUT' : p.stock <= 5 ? 'CRITICAL' : p.stock <= 15 ? 'LOW' : 'OK'
      return [`"${p.name}"`, p.category, p.stock, p.sold, p.price, p.price * p.stock, st].join(',')
    })
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(blob)
    a.download = `shopno-inventory-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  // ── RENDER ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 20 }}>

      {/* ── KPI Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? 'repeat(2, 1fr)'
          : 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: isMobile ? 10 : 14,
      }}>
        {[
          { label: 'Total Stock', value: kpi.totalUnits.toLocaleString(), icon: <Package size={18} />, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Total Sold', value: kpi.totalSold.toLocaleString(), icon: <TrendingUp size={18} />, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Catalog Value', value: `৳${kpi.totalCatalogValue.toLocaleString()}`, icon: <BarChart3 size={18} />, color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Out of Stock', value: kpi.outOfStock.length, icon: <XCircle size={18} />, color: '#dc2626', bg: '#fee2e2', alert: kpi.outOfStock.length > 0 },
          { label: 'Critical ≤5', value: kpi.critical.length, icon: <AlertTriangle size={18} />, color: '#d97706', bg: '#fef3c7', alert: kpi.critical.length > 0 },
        ].map((card, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14,
            border: card.alert ? `1.5px solid ${card.color}55` : '1px solid #e2e8f0',
            padding: isMobile ? '12px 14px' : '16px 18px',
            boxShadow: card.alert ? `0 0 0 2px ${card.color}18` : '0 2px 12px rgba(15,23,42,0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {card.label}
                </div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, color: card.color, marginTop: 3 }}>
                  {card.value}
                </div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color,
              }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Alert Banner ── */}
      {(kpi.outOfStock.length > 0 || kpi.critical.length > 0) && (
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2, #fff7ed)',
          border: '1px solid #fecaca', borderRadius: 12, padding: '12px 16px',
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#991b1b' }}>Inventory Alert</div>
              <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 1 }}>
                {kpi.outOfStock.length > 0 && <span><strong>{kpi.outOfStock.length}</strong> out of stock · </span>}
                {kpi.critical.length > 0 && <span><strong>{kpi.critical.length}</strong> critically low (≤5 units)</span>}
              </div>
            </div>
          </div>
          <button
            onClick={() => setStockFilter('critical')}
            style={{
              background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8,
              padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              whiteSpace: 'nowrap', alignSelf: isMobile ? 'flex-start' : 'center',
            }}
          >
            View Critical
          </button>
        </div>
      )}

      {/* ── Search + Filter Bar ── */}
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
        padding: isMobile ? 12 : 16,
        boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Search row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={isMobile ? 'Search products...' : 'Search by name, category, ID...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 30px', borderRadius: 10,
                border: '1px solid #cbd5e1', fontSize: 13, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: showFilters ? '#eff6ff' : '#f8fafc',
                color: showFilters ? '#2563eb' : '#475569',
                border: showFilters ? '1.5px solid #bfdbfe' : '1px solid #e2e8f0',
                borderRadius: 10, padding: '9px 12px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <Filter size={14} />
              Filters
            </button>
          )}
          {!isMobile && (
            <>
              <button
                onClick={() => setShowMovLog(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: '#f5f3ff', color: '#7c3aed',
                  border: '1px solid #c4b5fd', borderRadius: 10,
                  padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                <History size={13} /> Log
              </button>
              <button
                onClick={exportCsv}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: '#ecfdf5', color: '#059669',
                  border: '1px solid #a7f3d0', borderRadius: 10,
                  padding: '9px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                <Download size={13} /> CSV
              </button>
            </>
          )}
        </div>

        {/* Filter chips — always visible on desktop, collapsible on mobile */}
        {(!isMobile || showFilters) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Stock status pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'all',      label: 'All',          count: products.length },
                { id: 'out',      label: '❌ Out',        count: kpi.outOfStock.length, danger: true },
                { id: 'critical', label: '🚨 Critical',  count: kpi.critical.length,   danger: true },
                { id: 'low',      label: '⚠️ Low',       count: kpi.low.length },
                { id: 'ok',       label: '✅ OK',        count: products.length - kpi.outOfStock.length - kpi.critical.length - kpi.low.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStockFilter(tab.id)}
                  style={{
                    padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: stockFilter === tab.id
                      ? `1.5px solid ${tab.danger ? '#dc2626' : '#2563eb'}`
                      : '1px solid #e2e8f0',
                    background: stockFilter === tab.id
                      ? (tab.danger ? '#fee2e2' : '#eff6ff')
                      : '#fff',
                    color: stockFilter === tab.id
                      ? (tab.danger ? '#b91c1c' : '#1d4ed8')
                      : '#475569',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  {tab.label}
                  <span style={{
                    background: stockFilter === tab.id ? (tab.danger ? '#dc2626' : '#2563eb') : '#f1f5f9',
                    color: stockFilter === tab.id ? '#fff' : '#64748b',
                    fontSize: 10, fontWeight: 800, padding: '1px 5px', borderRadius: 99,
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Category + sort + action buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '7px 10px', borderRadius: 9, border: '1px solid #cbd5e1',
                  fontSize: 12, outline: 'none', background: '#fff', cursor: 'pointer', flex: 1, minWidth: 130,
                }}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '7px 10px', borderRadius: 9, border: '1px solid #cbd5e1',
                  fontSize: 12, outline: 'none', background: '#fff', cursor: 'pointer', flex: 1, minWidth: 150,
                }}
              >
                <option value="stock_asc">Stock ↑ (Lowest first)</option>
                <option value="stock_desc">Stock ↓ (Highest first)</option>
                <option value="sold">Best Sellers</option>
                <option value="name">A → Z</option>
              </select>

              {isMobile && (
                <>
                  <button
                    onClick={() => setShowMovLog(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: '#f5f3ff', color: '#7c3aed',
                      border: '1px solid #c4b5fd', borderRadius: 9,
                      padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <History size={13} /> Log
                  </button>
                  <button
                    onClick={exportCsv}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: '#ecfdf5', color: '#059669',
                      border: '1px solid #a7f3d0', borderRadius: 9,
                      padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <Download size={13} /> CSV
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Product List ── */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
        padding: isMobile ? '14px 12px' : 20,
        boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 14, flexWrap: 'wrap', gap: 8,
        }}>
          <div>
            <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Product Inventory Ledger
            </h3>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {filtered.length} of {products.length} products
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 11,
            color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 8, padding: '5px 10px',
          }}>
            <Layers size={12} />
            Live Sync Active
          </div>
        </div>

        {/* Mobile/Tablet: Cards | Desktop: Table */}
        {isMobile || isTablet ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>
                No products match your filters.
              </div>
            ) : (
              filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  movements={movements}
                  onRestock={setRestockTarget}
                  expanded={expandedId === product.id}
                  onToggleExpand={() => setExpandedId(expandedId === product.id ? null : product.id)}
                />
              ))
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
              <thead>
                <tr style={{
                  background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0',
                  color: '#64748b', fontSize: 11, textTransform: 'uppercase',
                }}>
                  <th style={{ padding: '11px 16px', textAlign: 'left', width: '35%' }}>Product</th>
                  <th style={{ padding: '11px 16px', textAlign: 'center', width: '10%' }}>Stock</th>
                  <th style={{ padding: '11px 16px', textAlign: 'center', width: '14%' }}>Status</th>
                  <th style={{ padding: '11px 16px', textAlign: 'center', width: '10%' }}>Sold</th>
                  <th style={{ padding: '11px 16px', textAlign: 'right', width: '16%' }}>Price / Value</th>
                  <th style={{ padding: '11px 16px', textAlign: 'center', width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                      No products match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      movements={movements}
                      onRestock={setRestockTarget}
                      expanded={expandedId === product.id}
                      onToggleExpand={() => setExpandedId(expandedId === product.id ? null : product.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick Restock Panel ── */}
      {kpi.critical.length > 0 && (
        <div style={{
          background: '#fff', borderRadius: 14, border: '1.5px solid #fde68a',
          padding: isMobile ? '14px 12px' : 20,
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={16} color="#d97706" />
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#92400e', margin: 0 }}>
              Quick Restock — Critical Items
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {kpi.critical.map((product) => (
              <div key={product.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                flexWrap: 'wrap',
                background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px',
              }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 13 }}>{product.name}</div>
                  <div style={{ fontSize: 11, color: '#78350f' }}>
                    Only <strong>{product.stock}</strong> unit(s) left
                  </div>
                </div>
                <button
                  onClick={() => setRestockTarget(product)}
                  style={{
                    background: '#d97706', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <Plus size={13} /> Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Movement Log Modal ── */}
      {showMovLog && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)',
            backdropFilter: 'blur(6px)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
          onClick={() => setShowMovLog(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: 20, width: '100%',
              maxWidth: isMobile ? '100%' : 680,
              maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)', padding: isMobile ? '20px 16px' : 28,
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMovLog(false)}
              style={{
                position: 'absolute', top: 14, right: 14, background: '#f1f5f9',
                border: 'none', borderRadius: '50%', width: 30, height: 30,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={15} color="#64748b" />
            </button>

            <span style={{ fontSize: 10, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Audit Trail
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '4px 0 4px' }}>
              Full Movement History
            </h2>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
              {movements.length} events logged
            </div>

            {movements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                No inventory movements recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {movements.map((mv) => {
                  const mt = MOVEMENT_TYPES[mv.type] || MOVEMENT_TYPES.ADJUSTMENT
                  return (
                    <div key={mv.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      flexWrap: isMobile ? 'wrap' : 'nowrap',
                      background: '#f8fafc', border: '1px solid #e2e8f0',
                      borderRadius: 10, padding: '10px 12px',
                    }}>
                      <div style={{
                        background: mt.bg, color: mt.color, borderRadius: 8,
                        padding: '3px 8px', fontSize: 11, fontWeight: 800, flexShrink: 0,
                      }}>
                        {mt.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 13 }}>{mv.productName}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                          <span style={{ color: mt.color, fontWeight: 700 }}>{mt.label}</span>
                          {' · '}
                          <span style={{ color: mv.qty > 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                            {mv.qty > 0 ? '+' : ''}{mv.qty}
                          </span>
                          {' · '}
                          {mv.stockBefore} → <strong>{mv.stockAfter}</strong>
                          {mv.note && <em style={{ color: '#64748b' }}> · "{mv.note}"</em>}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', flexShrink: 0 }}>
                        {new Date(mv.timestamp).toLocaleString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Restock Modal ── */}
      {restockTarget && (
        <RestockModal
          product={restockTarget}
          onConfirm={applyMovement}
          onClose={() => setRestockTarget(null)}
        />
      )}
    </div>
  )
}

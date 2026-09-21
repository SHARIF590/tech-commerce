import { useState, useMemo } from 'react'
import {
  Search,
  Printer,
  MessageCircle,
  Copy,
  Trash2,
  X,
  FileText,
} from 'lucide-react'

export default function OrdersManager({ orders = [], onUpdateStatus, onDeleteOrder }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [copiedTrx, setCopiedTrx] = useState('')

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim()
        const matchId = o.orderId.toLowerCase().includes(q)
        const matchName = o.customer?.name?.toLowerCase().includes(q)
        const matchPhone = o.customer?.phone?.toLowerCase().includes(q)
        const matchTrx = o.customer?.trxId?.toLowerCase().includes(q)
        return matchId || matchName || matchPhone || matchTrx
      }
      return true
    })
  }, [orders, statusFilter, searchTerm])

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedTrx(key)
    setTimeout(() => setCopiedTrx(''), 2000)
  }

  const openWhatsApp = (order) => {
    const phone = order.customer?.phone?.replace(/[^0-9]/g, '') || ''
    const normalizedPhone = phone.startsWith('88') ? phone : '88' + phone
    const text = `Hello ${order.customer?.name || 'Valued Customer'}, greetings from Shopno IT Limited!\n\nRegarding your Order #${order.orderId} (Total: ৳${order.total}):\nWe have received your payment via ${order.customer?.paymentMethod?.toUpperCase()} (TrxID: ${order.customer?.trxId}).\n\nYour digital software license and setup instructions are being processed. Thank you for choosing Shopno IT!`
    window.open(`https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const statusList = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'pending').length, color: '#f59e0b' },
    { id: 'verified', label: 'Payment Verified', count: orders.filter((o) => o.status === 'verified').length, color: '#3b82f6' },
    { id: 'processing', label: 'Processing', count: orders.filter((o) => o.status === 'processing').length, color: '#8b5cf6' },
    { id: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'completed').length, color: '#10b981' },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length, color: '#ef4444' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Filter Buttons & Search */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 16,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {statusList.map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 99,
                border: statusFilter === st.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: statusFilter === st.id ? '#eff6ff' : '#ffffff',
                color: statusFilter === st.id ? '#1d4ed8' : '#475569',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>{st.label}</span>
              <span
                style={{
                  background: statusFilter === st.id ? '#2563eb' : '#f1f5f9',
                  color: statusFilter === st.id ? '#fff' : '#64748b',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 99,
                }}
              >
                {st.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
            <input
              type="text"
              placeholder="Search by Order ID (SIT-...), Customer Name, Phone, or bKash TrxID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 20,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Order &amp; Date</th>
                <th style={{ padding: '12px 14px' }}>Customer Info</th>
                <th style={{ padding: '12px 14px' }}>Items &amp; Total</th>
                <th style={{ padding: '12px 14px' }}>Payment &amp; TrxID</th>
                <th style={{ padding: '12px 14px' }}>Workflow Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                    No orders found matching your search or status filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const statusColors = {
                    pending: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
                    verified: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
                    processing: { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' },
                    completed: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
                    cancelled: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
                  }
                  const sc = statusColors[ord.status] || statusColors.pending
                  const isTrxCopied = copiedTrx === ord.orderId

                  return (
                    <tr key={ord.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Order & Date */}
                      <td style={{ padding: '14px' }}>
                        <strong style={{ display: 'block', color: '#0f172a', fontSize: 14 }}>
                          {ord.orderId}
                        </strong>
                        <span style={{ fontSize: 11, color: '#64748b' }}>{ord.date}</span>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{ord.customer?.name}</div>
                        <div style={{ fontSize: 12, color: '#2563eb' }}>{ord.customer?.phone}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{ord.customer?.email}</div>
                      </td>

                      {/* Items & Total */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#1d4ed8' }}>
                          ৳ {Number(ord.total).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          {ord.items?.length || 0} item(s): {ord.items?.[0]?.name}
                          {ord.items?.length > 1 && ` +${ord.items.length - 1} more`}
                        </div>
                      </td>

                      {/* Payment & TrxID */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              textTransform: 'uppercase',
                              fontSize: 11,
                              fontWeight: 800,
                              background: '#f1f5f9',
                              padding: '2px 6px',
                              borderRadius: 4,
                              color: '#334155',
                            }}
                          >
                            {ord.customer?.paymentMethod || 'bKash'}
                          </span>
                        </div>
                        {ord.customer?.trxId && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                            <code
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#0f172a',
                              }}
                            >
                              {ord.customer.trxId}
                            </code>
                            <button
                              onClick={() => copyToClipboard(ord.customer.trxId, ord.orderId)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: isTrxCopied ? '#16a34a' : '#94a3b8',
                                padding: 2,
                              }}
                              title="Copy Transaction ID"
                            >
                              <Copy size={13} />
                            </button>
                          </div>
                        )}
                        {ord.customer?.senderNumber && (
                          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                            Sender: {ord.customer.senderNumber}
                          </div>
                        )}
                      </td>

                      {/* Workflow Status Dropdown */}
                      <td style={{ padding: '14px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateStatus(ord.orderId, e.target.value)}
                          style={{
                            background: sc.bg,
                            color: sc.text,
                            border: `1px solid ${sc.border}`,
                            padding: '5px 10px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none',
                            textTransform: 'capitalize',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Payment Verified</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          {/* WhatsApp Customer Contact */}
                          <button
                            onClick={() => openWhatsApp(ord)}
                            style={{
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              color: '#059669',
                              padding: '6px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                            title="Direct WhatsApp Notification to customer"
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp</span>
                          </button>

                          {/* View / Print Invoice Modal */}
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              padding: '6px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                            title="View Invoice & Receipt"
                          >
                            <FileText size={14} />
                            <span>Invoice</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Remove Order #${ord.orderId} permanently?`)) {
                                onDeleteOrder(ord.orderId)
                              }
                            }}
                            style={{
                              background: '#fff5f5',
                              border: '1px solid #fecaca',
                              color: '#ef4444',
                              padding: '6px 8px',
                              borderRadius: 6,
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                            title="Delete order record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice & Order Details Modal */}
      {selectedOrder && (
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
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 680,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              padding: 32,
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Official Digital Receipt &amp; Voucher
                </span>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
                  Order #{selectedOrder.orderId}
                </h2>
                <div style={{ fontSize: 12, color: '#64748b' }}>Date: {selectedOrder.date}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#1e293b',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Printer size={14} />
                  Print
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Customer Details Box */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                background: '#f8fafc',
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Customer Name</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selectedOrder.customer?.name}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>Phone: {selectedOrder.customer?.phone}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>Email: {selectedOrder.customer?.email}</div>
              </div>

              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Payment Details</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  {selectedOrder.customer?.paymentMethod}
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>TrxID: <strong>{selectedOrder.customer?.trxId || 'N/A'}</strong></div>
                {selectedOrder.customer?.senderNumber && (
                  <div style={{ fontSize: 12, color: '#475569' }}>Sender: {selectedOrder.customer?.senderNumber}</div>
                )}
              </div>
            </div>

            {/* Customer Special Notes */}
            {selectedOrder.customer?.notes && (
              <div style={{ marginBottom: 20, padding: 12, borderRadius: 8, background: '#fffbeb', border: '1px solid #fde68a', fontSize: 12 }}>
                <strong style={{ color: '#b45309', display: 'block', marginBottom: 2 }}>Customer Delivery Note:</strong>
                <span style={{ color: '#78350f' }}>{selectedOrder.customer.notes}</span>
              </div>
            )}

            {/* Items Table */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Purchased License Items</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Item Description</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 600, color: '#1e293b' }}>{item.name}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: '#64748b' }}>{item.qty || 1}</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#64748b' }}>৳ {item.price}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        ৳ {(item.price * (item.qty || 1)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                      Grand Total:
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 900, color: '#2563eb', fontSize: 16 }}>
                      ৳ {Number(selectedOrder.total).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    onUpdateStatus(selectedOrder.orderId, e.target.value)
                    setSelectedOrder((prev) => ({ ...prev, status: e.target.value }))
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Payment Verified</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => openWhatsApp(selectedOrder)}
                style={{
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <MessageCircle size={16} />
                Send Credentials via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

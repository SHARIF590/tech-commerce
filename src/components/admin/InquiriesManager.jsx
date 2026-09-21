import { useState, useMemo } from 'react'
import {
  Search,
  MessageCircle,
  Mail,
  Trash2,
  User,
} from 'lucide-react'

export default function InquiriesManager({
  inquiries = [],
  onUpdateStatus,
  onDeleteInquiry,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter !== 'all' && inq.status !== statusFilter) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim()
        return (
          inq.name.toLowerCase().includes(q) ||
          inq.phone.toLowerCase().includes(q) ||
          inq.email.toLowerCase().includes(q) ||
          inq.subject.toLowerCase().includes(q) ||
          inq.message.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [inquiries, statusFilter, searchTerm])

  const openWhatsAppReply = (inq) => {
    const raw = inq.phone.replace(/[^0-9]/g, '')
    const phone = raw.startsWith('88') ? raw : '88' + raw
    const text = `Hello ${inq.name}, thank you for reaching out to Shopno IT Limited regarding "${inq.subject}". How can our software support team assist you today?`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')
    onUpdateStatus(inq.id, 'contacted')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 16,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'new', 'contacted', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                border: statusFilter === st ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: statusFilter === st ? '#eff6ff' : '#fff',
                color: statusFilter === st ? '#1d4ed8' : '#475569',
                fontSize: 12.5,
                fontWeight: 700,
                textTransform: 'capitalize',
                cursor: 'pointer',
              }}
            >
              {st} ({st === 'all' ? inquiries.length : inquiries.filter((i) => i.status === st).length})
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 260 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder="Search leads by name, phone, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 12.5,
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Leads List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: 48,
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            No customer inquiries found for this filter.
          </div>
        ) : (
          filtered.map((inq) => {
            const statusConfig = {
              new: { bg: '#fef3c7', text: '#92400e', label: 'New Lead' },
              contacted: { bg: '#dbeafe', text: '#1e40af', label: 'Contacted' },
              resolved: { bg: '#dcfce7', text: '#15803d', label: 'Resolved' },
            }
            const cfg = statusConfig[inq.status] || statusConfig.new

            return (
              <div
                key={inq.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  padding: 20,
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                      }}
                    >
                      <User size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 14, color: '#0f172a' }}>{inq.name}</strong>
                        <span
                          style={{
                            background: cfg.bg,
                            color: cfg.text,
                            padding: '2px 8px',
                            borderRadius: 99,
                            fontSize: 10.5,
                            fontWeight: 800,
                          }}
                        >
                          ● {cfg.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 12, marginTop: 2 }}>
                        <span>Phone: <strong>{inq.phone}</strong></span>
                        {inq.email && <span>Email: {inq.email}</span>}
                        <span>Received: {inq.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => openWhatsAppReply(inq)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#059669',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>Reply WhatsApp</span>
                    </button>

                    {inq.email && (
                      <a
                        href={`mailto:${inq.email}?subject=Regarding your Shopno IT Inquiry: ${encodeURIComponent(inq.subject)}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <Mail size={14} />
                        <span>Email</span>
                      </a>
                    )}

                    <select
                      value={inq.status}
                      onChange={(e) => onUpdateStatus(inq.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <option value="new">Mark New</option>
                      <option value="contacted">Mark Contacted</option>
                      <option value="resolved">Mark Resolved</option>
                    </select>

                    <button
                      onClick={() => {
                        if (confirm('Delete this inquiry?')) onDeleteInquiry(inq.id)
                      }}
                      style={{
                        background: '#fff5f5',
                        border: '1px solid #fecaca',
                        color: '#ef4444',
                        padding: '6px 8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Inquiry Body */}
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: 10,
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                    Subject: {inq.subject}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {inq.message}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

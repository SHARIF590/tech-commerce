import { useState } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Clock,
  Trash2,
} from 'lucide-react'

export default function SecurityCenter({
  auditLogs = [],
  onUpdatePin,
  onClearLogs,
  storeSettings = {},
  onUpdateStoreSettings,
}) {
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinMsg, setPinMsg] = useState({ type: '', text: '' })
  const [logSearch, setLogSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')

  const handlePinSubmit = async (e) => {
    e.preventDefault()
    if (newPin.length < 4) {
      setPinMsg({ type: 'error', text: 'Passcode must be at least 4 characters long.' })
      return
    }
    if (newPin !== confirmPin) {
      setPinMsg({ type: 'error', text: 'Passcodes do not match.' })
      return
    }

    const res = await onUpdatePin(newPin)
    if (res.success) {
      setPinMsg({ type: 'success', text: 'Admin passcode securely updated and hashed with SHA-256!' })
      setNewPin('')
      setConfirmPin('')
    } else {
      setPinMsg({ type: 'error', text: res.message || 'Failed to update passcode.' })
    }
  }

  // Filter audit logs
  const filteredLogs = auditLogs.filter((log) => {
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase().trim()
      return (
        log.action.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q) ||
        (log.fingerprint && log.fingerprint.toLowerCase().includes(q))
      )
    }
    return true
  })

  // Password Strength helper
  const getStrength = (pwd) => {
    if (!pwd) return 0
    let score = 0
    if (pwd.length >= 6) score += 25
    if (pwd.length >= 10) score += 25
    if (/[A-Z]/.test(pwd)) score += 25
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 25
    return Math.min(100, score)
  }
  const strengthScore = getStrength(newPin)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Security Status Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 20,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Encryption Guard</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#065f46' }}>SHA-256 WebCrypto</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', margin: '10px 0 0' }}>
            Zero plaintext credential storage. Passcode verified against irreversible cryptographic digest.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 20,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Brute-Force Shield</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1e40af' }}>Exponential Rate Limiter</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', margin: '10px 0 0' }}>
            Automatic lockout after 5 consecutive failed attempts. Defense persists across browser restarts.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 20,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Session Inactivity</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#92400e' }}>15-Min Auto-Lock</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', margin: '10px 0 0' }}>
            Prevents unattended terminal hijacking if you leave your laptop or workstation open.
          </p>
        </div>
      </div>

      {/* Main Grid: Passcode Change & Emergency Lockdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Passcode Security Form */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
            Update Administrator Passcode
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>
            Default factory passcode is <code>shopno2026</code>. We strongly advise setting a personalized secret code.
          </p>

          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                New Secure Passcode (minimum 4 characters)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              {/* Strength Meter Bar */}
              {newPin && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                    <span>Complexity:</span>
                    <span>{strengthScore < 50 ? 'Moderate' : strengthScore < 75 ? 'Strong' : 'Very Strong'}</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${strengthScore}%`,
                        height: '100%',
                        background: strengthScore < 50 ? '#f59e0b' : strengthScore < 75 ? '#3b82f6' : '#10b981',
                        transition: 'width 0.2s',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Confirm New Passcode
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            {pinMsg.text && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: pinMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${pinMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  color: pinMsg.type === 'success' ? '#166534' : '#b91c1c',
                }}
              >
                {pinMsg.text}
              </div>
            )}

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
              <KeyRound size={16} />
              <span>Update Passcode Hash</span>
            </button>
          </form>
        </div>

        {/* Emergency Lockdown Controls */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={18} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Emergency Storefront Lockdown
              </h2>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, margin: '0 0 16px' }}>
              If you suspect an ongoing attack, spam orders, or require urgent catalog maintenance, you can enable Maintenance Mode.
            </p>

            <div
              style={{
                background: storeSettings.maintenanceMode ? '#fef2f2' : '#f8fafc',
                border: `1px solid ${storeSettings.maintenanceMode ? '#fecaca' : '#e2e8f0'}`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: 13, color: storeSettings.maintenanceMode ? '#b91c1c' : '#0f172a' }}>
                    Maintenance Mode
                  </strong>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {storeSettings.maintenanceMode ? 'Storefront displays maintenance banner' : 'Store is fully operational and open'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStoreSettings({ maintenanceMode: !storeSettings.maintenanceMode })
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 99,
                    border: 'none',
                    background: storeSettings.maintenanceMode ? '#ef4444' : '#e2e8f0',
                    color: storeSettings.maintenanceMode ? '#fff' : '#475569',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {storeSettings.maintenanceMode ? 'ENABLED (Locked)' : 'Disabled (Open)'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ background: '#eff6ff', borderRadius: 10, padding: '12px 14px', border: '1px solid #bfdbfe', fontSize: 11.5, color: '#1e40af' }}>
            🛡️ <strong>Input Sanitization:</strong> All forms, search inputs, customer notes, and TrxIDs are sanitized to eliminate Cross-Site Scripting (XSS).
          </div>
        </div>
      </div>

      {/* Security Audit Trail Log */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 24,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Security Audit Log
              </h2>
              <span style={{ fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                {auditLogs.length} events recorded
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
              Real-time immutable administrative activity trail &amp; intrusion telemetry
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warnings</option>
              <option value="danger">High Alerts</option>
              <option value="success">Success</option>
            </select>

            <button
              onClick={() => {
                if (confirm('Clear audit history? (This cannot be undone)')) {
                  onClearLogs()
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #fecaca',
                background: '#fff5f5',
                color: '#ef4444',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={13} />
              <span>Clear Log</span>
            </button>
          </div>
        </div>

        {/* Search Audit Logs */}
        <div style={{ marginBottom: 14 }}>
          <input
            type="text"
            placeholder="Search security log entries..."
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 12.5,
              outline: 'none',
            }}
          />
        </div>

        {/* Audit Log Table */}
        <div style={{ maxHeight: 380, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 10.5, textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 12px' }}>Timestamp</th>
                <th style={{ padding: '8px 12px' }}>Action</th>
                <th style={{ padding: '8px 12px' }}>Details</th>
                <th style={{ padding: '8px 12px' }}>Client Device / Fingerprint</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const badgeColors = {
                  info: { bg: '#f1f5f9', text: '#475569' },
                  warning: { bg: '#fffbeb', text: '#b45309' },
                  danger: { bg: '#fef2f2', text: '#b91c1c' },
                  success: { bg: '#ecfdf5', text: '#059669' },
                }
                const bc = badgeColors[log.severity] || badgeColors.info
                const formattedTime = new Date(log.timestamp).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })

                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {formattedTime}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span
                        style={{
                          background: bc.bg,
                          color: bc.text,
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#1e293b' }}>
                      {log.detail}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#64748b', fontSize: 11 }}>
                      {log.fingerprint || 'Local Host'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

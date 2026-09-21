import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

export default function AdminAuthModal({
  onAuthenticate,
  onReturnToStore,
  lockoutUntil,
  verifyAdminPin,
}) {
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [remainingSec, setRemainingSec] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Countdown timer for lockout
  useEffect(() => {
    const checkLockout = () => {
      const now = Date.now()
      if (lockoutUntil > now) {
        setRemainingSec(Math.ceil((lockoutUntil - now) / 1000))
      } else {
        setRemainingSec(0)
      }
    }

    checkLockout()
    const timer = setInterval(checkLockout, 1000)
    return () => clearInterval(timer)
  }, [lockoutUntil])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (remainingSec > 0 || isSubmitting) return

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const result = await verifyAdminPin(pin)
      if (result.success) {
        onAuthenticate()
      } else {
        setErrorMsg(result.message)
        if (result.locked) {
          setRemainingSec(result.remainingSec)
        }
      }
    } catch (err) {
      console.error('Auth verification error:', err)
      setErrorMsg('Authentication error. Please retry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLocked = remainingSec > 0

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 24,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          maxWidth: 440,
          width: '100%',
          padding: 40,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Accent Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: isLocked
              ? 'linear-gradient(90deg, #ef4444, #f97316)'
              : 'linear-gradient(90deg, #2563eb, #38bdf8)',
          }}
        />

        {/* Shield Icon */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: isLocked ? '#fef2f2' : '#eff6ff',
            color: isLocked ? '#dc2626' : '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: `1.5px solid ${isLocked ? '#fecaca' : '#bfdbfe'}`,
          }}
        >
          {isLocked ? <ShieldAlert size={30} /> : <ShieldCheck size={30} />}
        </div>

        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#2563eb',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Management Portal
          </span>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '4px 0 8px' }}>
            Shopno IT Console
          </h1>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>
            Enterprise catalog, orders &amp; revenue workstation. Protected by cryptographic authentication.
          </p>
        </div>

        {/* Lockout Warning Banner */}
        {isLocked && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <ShieldAlert size={22} color="#dc2626" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#991b1b' }}>
                Brute-Force Rate Limiter Active
              </div>
              <div style={{ fontSize: 11.5, color: '#b91c1c', marginTop: 2 }}>
                Too many failed attempts. Portal locked for <strong>{remainingSec}s</strong>.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Administrator Passcode
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPin ? 'text' : 'password'}
                placeholder="Enter secret passcode"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={isLocked}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 16px',
                  borderRadius: 12,
                  border: isLocked ? '1.5px solid #fca5a5' : '1.5px solid #cbd5e1',
                  fontSize: 14,
                  outline: 'none',
                  background: isLocked ? '#f8fafc' : '#ffffff',
                  cursor: isLocked ? 'not-allowed' : 'text',
                  letterSpacing: showPin ? 'normal' : '0.15em',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 13,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMsg && !isLocked && (
            <div
              style={{
                fontSize: 12,
                color: '#dc2626',
                fontWeight: 600,
                background: '#fef2f2',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #fecaca',
              }}
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || isSubmitting}
            style={{
              width: '100%',
              minHeight: 46,
              fontSize: 14,
              fontWeight: 800,
              borderRadius: 12,
              border: 'none',
              background: isLocked
                ? '#94a3b8'
                : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: isLocked ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s',
            }}
          >
            {isLocked ? (
              `Locked (${remainingSec}s)`
            ) : isSubmitting ? (
              'Verifying Credentials...'
            ) : (
              <>
                <span>Unlock Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footnote & Default Credentials Notice */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 12 }}>
            Default factory passcode: <code>shopno2026</code>
          </div>

          <button
            onClick={onReturnToStore}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2563eb',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Live Storefront</span>
          </button>
        </div>
      </div>
    </div>
  )
}

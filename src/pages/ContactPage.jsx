import { useState, useEffect } from 'react'
import { useProducts } from '../context/ProductContext'

export default function ContactPage() {
  const { addInquiry } = useProducts()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.name && (form.phone || form.email)) {
      addInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        subject: form.subject || 'General Inquiry',
        message: form.message.trim(),
      })
    }
    setSubmitted(true)
  }

  const handleWhatsAppDirect = () => {
    const text = `Hello Shopno IT Team, my name is ${form.name || 'Customer'}. I am interested in "${form.subject}". Query: ${form.message || 'I would like more details.'}`
    const url = `https://wa.me/8801618979790?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const faqs = [
    {
      q: 'How fast do I receive my subscription or license key?',
      a: 'Digital voucher codes and private subscription credentials are sent directly to your WhatsApp and Email within 15 to 30 minutes following payment verification.',
    },
    {
      q: 'Can I purchase directly via WhatsApp or Phone call?',
      a: 'Yes! Our support desk at +88 01618-979790 is operational 24/7. You can place direct orders, request custom quotations, or get remote assistance.',
    },
    {
      q: 'How does the Replacement Guarantee work?',
      a: 'All subscriptions and genuine software licenses sold by Shopno IT include our full warranty. If an account encounters any downtime, our technicians replace it promptly at no extra charge.',
    },
    {
      q: 'Do you offer Corporate VAT & Bulk Invoicing for agencies?',
      a: 'Yes. We support custom multi-seat licenses (Canva Team, Office 365 Enterprise, Google Workspace, Windows Bulk Keys) with official tax-compliant invoices.',
    },
  ]

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Vengeance High-Tech Telemetry Ribbon */}
      <div
        style={{
          background: '#090d16',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#94a3b8',
          fontSize: 11,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          padding: '8px 16px',
        }}
      >
        <div
          className="shell"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4ade80' }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                  display: 'inline-block',
                }}
              />
              SYSTEM: OPERATIONAL
            </span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ color: '#cbd5e1' }}>DHAKA HUB • 23.7516° N, 90.3770° E</span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ color: '#38bdf8' }}>BST: {currentTime || '10:00:00 AM'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span>AVG RESPONSE: &lt; 3 MINS</span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ color: '#fbbf24' }}>DISPATCH DESK: 10:00 AM – 11:00 PM</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% -20%, #1e3a8a30, transparent 70%), #fff',
          borderBottom: '1px solid var(--line)',
          padding: '48px 20px 40px',
          textAlign: 'center',
        }}
      >
        <div className="shell" style={{ maxWidth: 840, margin: '0 auto' }}>
          {/* Animaster Shimmer Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 24,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              marginBottom: 16,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#2563eb',
                boxShadow: '0 0 6px #2563eb',
              }}
            />
            Official Customer Care &amp; Corporate Desk
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900,
              color: 'var(--navy)',
              letterSpacing: '-0.03em',
              margin: '0 0 14px',
              lineHeight: 1.15,
            }}
          >
            We’re Ready to Assist You
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              color: 'var(--muted)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 620,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Have a question about subscriptions, software key activations, or corporate bulk pricing? Connect directly with our Dhaka technical desk.
          </p>

          {/* Telemetry Metric Block */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              marginTop: 32,
            }}
          >
            {[
              { label: 'Instant WhatsApp Desk', value: '24/7 Available', sub: 'Real human assistance' },
              { label: 'Key & License Dispatch', value: '15–30 Mins', sub: 'Email & WhatsApp delivery' },
              { label: 'Active IT Subscribers', value: '5,000+ Clients', sub: 'Across Bangladesh' },
              { label: 'Service Guarantee', value: '100% Replacement', sub: 'Verified genuine access' },
            ].map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '14px 16px',
                  textAlign: 'left',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                }}
              >
                <span style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                  {m.label}
                </span>
                <strong style={{ display: 'block', fontSize: 16, fontWeight: 800, color: 'var(--navy)', marginTop: 2 }}>
                  {m.value}
                </strong>
                <span style={{ display: 'block', fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>
                  {m.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Contact Section */}
      <div className="shell" style={{ paddingTop: 40 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
            alignItems: 'start',
          }}
        >
          {/* Left Column: Interactive Direct Support Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Primary WhatsApp Card with Glare Border */}
            <div
              style={{
                background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)',
                color: '#fff',
                borderRadius: 18,
                padding: 24,
                boxShadow: '0 12px 28px rgba(20, 83, 45, 0.18)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  background: 'radial-gradient(circle, rgba(74, 222, 128, 0.25) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    background: '#22c55e33',
                    color: '#86efac',
                    padding: '3px 8px',
                    borderRadius: 6,
                    border: '1px solid #22c55e55',
                  }}
                >
                  Fastest Support Channel
                </span>
                <span style={{ fontSize: 11, color: '#86efac', fontFamily: 'monospace' }}>● LIVE DESK</span>
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 6px', color: '#fff' }}>
                WhatsApp Direct Helpdesk
              </h3>
              <p style={{ fontSize: 13, color: '#bbf7d0', margin: '0 0 20px', lineHeight: 1.5 }}>
                Chat directly with our support engineers for instant activation assistance, warranty verification, and order placement.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <a
                  href="https://wa.me/8801618979790"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#22c55e',
                    color: '#022c22',
                    padding: '12px 18px',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 14,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.16-1.32c1.43.8 3.07 1.32 4.84 1.32 5.52 0 10-4.48 10-10S17.52 2 12 2zm4.72 14.28c-.2.57-1.16 1.05-1.63 1.09-.45.04-.97.05-3.08-.82-2.31-.96-3.8-3.32-3.92-3.48-.12-.16-.94-1.25-.94-2.38 0-1.13.59-1.69.8-1.92.21-.23.46-.29.62-.29.15 0 .31 0 .44.01.14.01.32-.05.5.38.2.47.67 1.63.73 1.75.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.39.66 1.63.78.24.12.4.18.46.28.06.1.06.58-.14 1.15z" />
                    </svg>
                    +88 01618-979790 (Main Desk)
                  </span>
                  <span>Chat Now →</span>
                </a>

                <a
                  href="https://wa.me/8801738979790"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '10px 18px',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: 'none',
                  }}
                >
                  <span>+88 01738-979790 (Billing &amp; Corporate)</span>
                  <span>Chat →</span>
                </a>
              </div>
            </div>

            {/* Channels List Box */}
            <div
              style={{
                background: '#fff',
                borderRadius: 18,
                border: '1px solid var(--line)',
                padding: 24,
                boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)', margin: '0 0 18px' }}>
                Direct Contact Points
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Phone Hotline */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#eff6ff',
                      color: 'var(--blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
                      TELEPHONE HOTLINE
                    </span>
                    <a href="tel:+8801618979790" style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', textDecoration: 'none' }}>
                      +88 01618-979790
                    </a>
                    <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      10:00 AM – 11:00 PM (Daily)
                    </span>
                  </div>
                </div>

                {/* Email Support */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#fff7ed',
                      color: '#ea580c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
                      OFFICIAL EMAIL DESK
                    </span>
                    <a href="mailto:support@shopnoit.com" style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', textDecoration: 'none' }}>
                      support@shopnoit.com
                    </a>
                    <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      Corporate sales &amp; VAT quotation
                    </span>
                  </div>
                </div>

                {/* Physical Location */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#f1f5f9',
                      color: 'var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
                      CENTRAL DISPATCH HUB
                    </span>
                    <strong style={{ display: 'block', fontSize: 13.5, color: 'var(--ink)' }}>
                      Dhanmondi-32, Dhaka-1207
                    </strong>
                    <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      Bangladesh • Operations &amp; Verification Center
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Luxury Inquiry & Instant Order Form */}
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              border: '1px solid var(--line)',
              padding: '32px 28px',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--navy)', margin: 0 }}>
                Send Us an Inquiry
              </h2>
              <span style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 700, background: '#eff6ff', padding: '3px 8px', borderRadius: 6 }}>
                Fast Response Desk
              </span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 24px', lineHeight: 1.5 }}>
              Fill out your details below. We verify licenses, answer setup questions, and provide custom quotes.
            </p>

            {submitted ? (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: 14,
                  padding: 28,
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800 }}>
                  ✓
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#15803d' }}>
                  Inquiry Dispatched Successfully
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                  Thank you, <strong>{form.name}</strong>. Your ticket has been registered with our Dhaka desk. We will reach out via WhatsApp at <strong>{form.phone}</strong> shortly.
                </p>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    style={{
                      background: '#22c55e',
                      color: '#022c22',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Open in WhatsApp Now →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setForm({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' })
                    }}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Send Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 10,
                        border: '1.5px solid #cbd5e1',
                        fontSize: 13,
                        outline: 'none',
                        transition: 'border 0.2s ease',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                      WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 10,
                        border: '1.5px solid #cbd5e1',
                        fontSize: 13,
                        outline: 'none',
                        transition: 'border 0.2s ease',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                      transition: 'border 0.2s ease',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Topic / Subscription of Interest *
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                      background: '#fff',
                    }}
                  >
                    <option value="CapCut Pro (PC & Mobile)">CapCut Pro (PC &amp; Mobile) Subscription</option>
                    <option value="Canva Pro (1 Year Private Access)">Canva Pro (1 Year Private Access)</option>
                    <option value="ChatGPT Plus & AI Tools">ChatGPT Plus &amp; Claude Pro Subscriptions</option>
                    <option value="Microsoft Office 365 / Windows 11 Key">Microsoft Office 365 / Windows 11 Pro Key</option>
                    <option value="Google Gemini Advanced + 5TB Cloud">Google Gemini Advanced + 5TB Cloud</option>
                    <option value="Corporate Bulk / VAT Invoicing">Corporate Bulk Licensing / VAT Invoice</option>
                    <option value="General Technical Support">General Technical Support &amp; Activation</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                    Your Message / Specific Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe what product, quantity, or activation query you have..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <button
                    type="submit"
                    className="button primary"
                    style={{
                      flex: 1.2,
                      minHeight: 48,
                      fontSize: 14,
                      fontWeight: 800,
                      borderRadius: 10,
                    }}
                  >
                    Submit Web Ticket →
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    style={{
                      flex: 1,
                      minHeight: 48,
                      fontSize: 13,
                      fontWeight: 800,
                      borderRadius: 10,
                      background: '#eff6ff',
                      color: 'var(--blue)',
                      border: '1.5px solid #bfdbfe',
                      cursor: 'pointer',
                    }}
                  >
                    Send on WhatsApp
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--green)' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>100% Privacy Protected. Your contact information is never shared.</span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: 56, maxWidth: 840, margin: '56px auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Resolution Guide
            </span>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--navy)', margin: '4px 0 8px' }}>
              Frequently Asked Support Questions
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
              Quick answers to the most common inquiries regarding orders, activations, and guarantees.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i
              return (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    transition: 'border 0.15s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '16px 20px',
                      background: isOpen ? '#f8fafc' : '#fff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--ink)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: 18, color: 'var(--blue)', fontWeight: 800 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', fontSize: 13, color: '#475569', lineHeight: 1.6, borderTop: '1px solid #f1f5f9' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

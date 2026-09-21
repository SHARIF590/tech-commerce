import { useState } from 'react'

export default function NoticeBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="notice-bar shell" style={{ background: '#07142d', borderColor: '#0d2550' }}>
      <span className="notice-badge" style={{ background: '#16a34a', color: '#ffffff' }}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
        </svg>
        নোটিশ
      </span>

      <div className="notice-marquee-wrap">
        <div className="notice-marquee" style={{ '--notice-fade': '#07142d' }}>
          <span>
            আগের দামে ফিরে এসেছে Gemini Pro 18 Month 200Tk &amp; Canva Pro 100Tk Instant Delivery
          </span>
          <span>
            100% Genuine Windows 11 Pro Retail Keys &amp; Office 365 with Replacement Warranty
          </span>
          <span>
            bKash ও Nagad পেমেন্ট এর সাথে সাথে ইনস্ট্যান্ট ডেলিভারি
          </span>
        </div>
      </div>

      <button
        className="notice-close"
        onClick={() => setVisible(false)}
        title="বন্ধ করুন"
        aria-label="Dismiss notice"
      >
        ✕
      </button>
    </div>
  )
}

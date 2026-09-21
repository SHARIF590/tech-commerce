import { useRouter } from '../context/RouterContext'

export default function SiteFooter() {
  const { navigate } = useRouter()

  return (
    <footer className="site-footer">
      <div className="footer-grid shell">
        {/* Column 1: Brand Info */}
        <section>
          <div className="brand" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={() => navigate('home')}>
            <div className="brand-logo-badge">S</div>
            <div className="brand-text">
              <div className="brand-title">
                Shopno<span>IT</span>
              </div>
              <div className="brand-tag">Digital Eshop</div>
            </div>
          </div>
          <p>
            Your trusted destination for genuine software, subscriptions and digital services in Bangladesh.
          </p>
          <a
            className="support-pill"
            onClick={() => navigate('contact')}
            style={{ cursor: 'pointer' }}
          >
            Contact Us · Get Support
          </a>
        </section>

        {/* Column 2: Categories */}
        <nav>
          <h3>Categories</h3>
          <a onClick={() => navigate('category/ai-services')} style={{ cursor: 'pointer' }}>
            AI Services
          </a>
          <a onClick={() => navigate('category/microsoft')} style={{ cursor: 'pointer' }}>
            Microsoft
          </a>
          <a onClick={() => navigate('category/windows-licences')} style={{ cursor: 'pointer' }}>
            Windows Licences
          </a>
          <a onClick={() => navigate('category/subscriptions')} style={{ cursor: 'pointer' }}>
            Subscriptions
          </a>
          <a onClick={() => navigate('category/privacy-security')} style={{ cursor: 'pointer' }}>
            Privacy &amp; Security
          </a>
        </nav>

        {/* Column 3: Quick Links */}
        <nav>
          <h3>Quick Links</h3>
          <a onClick={() => navigate('shop')} style={{ cursor: 'pointer' }}>Shop Catalog</a>
          <a onClick={() => navigate('cart')} style={{ cursor: 'pointer' }}>Cart</a>
          <a onClick={() => navigate('track-order')} style={{ cursor: 'pointer' }}>Account Status</a>
          <a onClick={() => navigate('about')} style={{ cursor: 'pointer' }}>About Us</a>
          <a onClick={() => navigate('legal')} style={{ cursor: 'pointer', color: '#93c5fd' }}>
            Reseller &amp; Legal Terms
          </a>
          <a
            onClick={() => navigate('contact')}
            style={{ fontWeight: 700, color: 'var(--cyan)', cursor: 'pointer' }}
          >
            Contact Us
          </a>
          <a
            onClick={() => navigate('track-order')}
            style={{ fontWeight: 700, color: '#f59e0b', cursor: 'pointer' }}
          >
            Track Order
          </a>
        </nav>

        {/* Column 4: Customer Support */}
        <section>
          <h3>Customer Support</h3>
          <p>Phone: +880 01738-979790</p>
          <p>Fast digital delivery (15–30 mins)</p>
          <p>Secure bKash &amp; Nagad checkout</p>
          <p>Dedicated replacement warranty</p>
          <a
            href="https://wa.me/8801738979790"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              padding: '8px 16px',
              background: '#25d366',
              color: '#fff',
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.087.535 4.047 1.47 5.757L0 24l6.395-1.677A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.005-1.376l-.36-.213-3.72.975.994-3.618-.234-.373A9.77 9.77 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
            </svg>
            WhatsApp Support
          </a>
        </section>
      </div>

      {/* Reseller & Trademark Legal Disclaimer Box */}
      <div className="shell" style={{ borderTop: '1px solid #1e293b', paddingTop: 20, paddingBottom: 16 }}>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.55)',
            borderRadius: 12,
            border: '1px solid #334155',
            padding: '16px 20px',
            fontSize: 11.5,
            color: '#94a3b8',
            lineHeight: 1.65,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--cyan)' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Legal Notice &amp; Nominative Fair Use Statement</span>
          </div>
          <div>
            Shopno IT Limited is an independent third-party distributor and service provider of software licenses and subscription access vouchers based in Dhanmondi-32, Dhaka, Bangladesh. All product names, registered trademarks, brand names, and logos displayed on this website (such as Microsoft, Windows, Office 365, Canva, OpenAI, ChatGPT, Google, Gemini, Adobe, CapCut, NordVPN, and Grammarly) are the property of their respective owners. Mention of these marks is solely for nominative identification of compatibility and voucher eligibility, and does not imply sponsorship, affiliation, or endorsement.
          </div>
          <div style={{ marginTop: 8 }}>
            <a onClick={() => navigate('legal')} style={{ color: 'var(--cyan)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>
              Read Full Reseller Policy, Warranty &amp; DMCA Takedown Procedures →
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="shell">
          <p>© {new Date().getFullYear()} <strong>Shopno IT Limited</strong>. Registered Digital Reseller (Dhanmondi-32, Dhaka). All rights reserved.</p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <a onClick={() => navigate('legal')} style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>Terms of Sale</a>
            <a onClick={() => navigate('legal')} style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>Fair Use Notice</a>
            <a onClick={() => navigate('admin')} style={{ fontSize: 12, color: 'var(--cyan)', cursor: 'pointer', fontWeight: 600 }}>Owner Portal (Admin)</a>
            <div className="payment-badges-row">
              <span className="payment-tag">bKash</span>
              <span className="payment-tag">Nagad</span>
              <span className="payment-tag">Rocket</span>
              <span className="payment-tag">Visa / Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

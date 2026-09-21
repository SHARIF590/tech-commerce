import { useRouter } from '../context/RouterContext'

export default function AboutPage() {
  const { navigate } = useRouter()

  return (
    <div>
      <div className="page-head">
        <div className="shell">
          <span>ABOUT SHOPNO IT LIMITED</span>
          <h1>Empowering Bangladesh with Genuine Digital Tools</h1>
          <p>Your premier destination for verified software licenses, cloud storage, and AI subscriptions since 2016.</p>
        </div>
      </div>

      <div className="shell" style={{ paddingTop: 40, paddingBottom: 64, maxWidth: 960 }}>
        {/* Story Section */}
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            border: '1px solid var(--line)',
            padding: 36,
            boxShadow: '0 4px 24px rgba(15, 23, 42, 0.04)',
            marginBottom: 36,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', margin: '0 0 16px' }}>
            Who We Are
          </h2>
          <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7, marginBottom: 16 }}>
            <strong>Shopno IT Limited</strong> was founded in 2016 in Dhanmondi-32, Dhaka, Bangladesh. We recognized a major hurdle faced by Bangladeshi freelancers, students, developers, agencies, and businesses: acquiring genuine software licenses and premium digital subscriptions typically required international dual-currency credit cards with complex verification.
          </p>
          <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>
            As an authorized independent IT product and digital subscription reseller, we bridged this gap. We provide 100% genuine retail product keys and authorized subscription invitations with instant local delivery via Email and WhatsApp, payable conveniently through bKash, Nagad, and Rocket.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              padding: 20,
              background: '#f8fafc',
              borderRadius: 14,
              border: '1px solid var(--line)',
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: 22, fontWeight: 800, color: 'var(--blue)' }}>2016</strong>
              <small style={{ color: 'var(--muted)', fontSize: 12 }}>Founded in Dhaka</small>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>10,000+</strong>
              <small style={{ color: 'var(--muted)', fontSize: 12 }}>Digital Orders Delivered</small>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: 22, fontWeight: 800, color: '#ea580c' }}>100%</strong>
              <small style={{ color: 'var(--muted)', fontSize: 12 }}>Genuine License Guarantee</small>
            </div>
          </div>
        </div>

        {/* 4 Core Guarantees */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', margin: '0 0 20px', textAlign: 'center' }}>
            Our Four Core Reseller Guarantees
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
                1
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                100% Genuine Retail Licenses
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                Every key activates online directly on official vendor servers (Microsoft, Kaspersky, Adobe). We never distribute cracks, patch files, or unauthorized KMS tools.
              </p>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ecfdf5', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
                2
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                Instant Automated Delivery
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                Keys and invitation links are dispatched directly to your Email and WhatsApp within 2–5 minutes of bKash/Nagad verification.
              </p>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
                3
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                Guaranteed Replacement Warranty
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                We stand firmly behind our products. If an activation key ever experiences an issue, our support team provides an immediate replacement or full refund.
              </p>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 12 }}>
                4
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>
                Free Remote AnyDesk Setup
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                Need help installing or activating? Our certified IT engineers provide free remote screen assistance via AnyDesk or TeamViewer daily.
              </p>
            </div>
          </div>
        </div>

        {/* Office & CTA */}
        <div
          style={{
            background: 'var(--navy)',
            borderRadius: 16,
            padding: 32,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>Visit Our Office in Dhaka</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#9db1cd' }}>
              Dhanmondi-32, Dhaka-1207, Bangladesh • Open 10:00 AM – 11:00 PM Daily
            </p>
          </div>
          <button className="button primary" onClick={() => navigate('shop')}>
            Explore Product Catalog →
          </button>
        </div>
      </div>
    </div>
  )
}

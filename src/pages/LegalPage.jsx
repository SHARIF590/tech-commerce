import { useRouter } from '../context/RouterContext'

export default function LegalPage() {
  const { navigate } = useRouter()

  return (
    <div>
      <div className="page-head">
        <div className="shell">
          <span>LEGAL &amp; REGULATORY COMPLIANCE</span>
          <h1>Terms, Reseller Policy &amp; Trademark Disclaimers</h1>
          <p>
            Transparency, nominative fair use statement, and customer warranty protection under Bangladesh law.
          </p>
        </div>
      </div>

      <div className="shell" style={{ paddingTop: 36, paddingBottom: 64, maxWidth: 900 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>
          <a onClick={() => navigate('home')} style={{ cursor: 'pointer', color: 'var(--blue)' }}>Home</a>
          <span>/</span>
          <strong style={{ color: 'var(--ink)' }}>Legal &amp; Compliance</strong>
        </div>

        {/* Highlight Box: Reseller & Trademark Fair Use Notice */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1.5px solid #cbd5e1',
            padding: 28,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#eff6ff',
                color: 'var(--blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
              Independent Reseller &amp; Nominative Fair Use Declaration
            </h2>
          </div>

          <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, margin: 0 }}>
            <strong>Shopno IT Limited</strong> (registered in Dhaka, Bangladesh) operates as an independent third-party distributor and service provider of genuine digital licenses, enterprise invitations, and software subscription vouchers. All product names, registered trademarks, logos, and brands mentioned on this website (including, but not limited to, <em>Microsoft, Windows, Office 365, Canva, OpenAI, ChatGPT, Google, Gemini, Adobe, CapCut, NordVPN, Grammarly, and Duolingo</em>) are the property of their respective owners.
          </p>
          <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>
            Their citation on this platform is made strictly for <strong>nominative fair use</strong> to identify compatibility, software versioning, and voucher eligibility. Such use does not imply any direct affiliation, sponsorship, endorsement, or certified partnership with the respective trademark holders unless explicitly stated.
          </p>
        </div>

        {/* Accordion / Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1: Business Identity & Legal Entity */}
          <section
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid var(--line)',
              padding: 28,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)', margin: '0 0 12px' }}>
              1. Business Identity &amp; Corporate Address
            </h3>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: '0 0 10px' }}>
              Shopno IT Limited has served the digital community in Bangladesh since 2016. Our physical and corporate billing operations are managed from:
            </p>
            <ul style={{ fontSize: 13, color: '#334155', lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li><strong>Operating Entity:</strong> Shopno IT Limited</li>
              <li><strong>Registered Office:</strong> Dhanmondi-32, Dhaka-1207, Bangladesh</li>
              <li><strong>Support Hotline:</strong> +88 01738-979790</li>
              <li><strong>Official Email:</strong> sales@shopnoit.com / legal@shopnoit.com</li>
            </ul>
          </section>

          {/* Section 2: Genuine License & Activation Warranty */}
          <section
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid var(--line)',
              padding: 28,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)', margin: '0 0 12px' }}>
              2. License Authenticity &amp; Replacement Warranty
            </h3>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: '0 0 10px' }}>
              We guarantee that all product keys and subscription invites distributed through Shopno IT Limited are 100% authentic and verifiable on official vendor servers:
            </p>
            <ul style={{ fontSize: 13, color: '#334155', lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li><strong>Direct Server Activation:</strong> All Windows and Office retail keys activate directly through Microsoft's official activation servers (<code>setup.office.com</code> or Windows Activation Settings).</li>
              <li><strong>Replacement Guarantee:</strong> If a delivered license key fails to activate during the initial setup window, a replacement key will be dispatched within 1 hour after verification.</li>
              <li><strong>Full Term Protection:</strong> Private subscription invitations (e.g., Canva Pro 1 Year) include dedicated renewal support for the entire duration purchased.</li>
            </ul>
          </section>

          {/* Section 3: Digital Delivery & Refund Policy */}
          <section
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid var(--line)',
              padding: 28,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)', margin: '0 0 12px' }}>
              3. Digital Delivery Terms &amp; Refund Policy
            </h3>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: '0 0 10px' }}>
              As digital goods and intangible software licenses are delivered electronically:
            </p>
            <ul style={{ fontSize: 13, color: '#334155', lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li><strong>Delivery Channels:</strong> Credentials and retail keys are dispatched via WhatsApp and verified Email within 15–30 minutes of payment confirmation.</li>
              <li><strong>Refunds on Defective Goods:</strong> If our technical support desk is unable to resolve an activation error or provide a working replacement key within 24 hours, a 100% full refund is issued back to the customer's bKash or Nagad wallet.</li>
              <li><strong>Buyer Responsibility:</strong> Customers must ensure their hardware meets the minimum operating system requirements before placing an order.</li>
            </ul>
          </section>

          {/* Section 4: DMCA / Copyright Inquiries */}
          <section
            style={{
              background: '#fff',
              borderRadius: 16,
              border: '1px solid var(--line)',
              padding: 28,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--navy)', margin: '0 0 12px' }}>
              4. IP Protection &amp; DMCA Takedown Procedure
            </h3>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>
              Shopno IT Limited respects intellectual property rights and adheres strictly to digital copyright compliance. If you are a copyright or trademark owner and believe any content on this website violates your rights, please submit a notice to our compliance department:
            </p>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: 16,
                fontSize: 13,
                color: '#334155',
              }}
            >
              <div><strong>Email:</strong> legal@shopnoit.com</div>
              <div><strong>Subject Line:</strong> Intellectual Property Notice - [Brand / Product Name]</div>
              <div><strong>Response Window:</strong> Our legal team reviews and processes inquiries within 24–48 business hours.</div>
            </div>
          </section>
        </div>

        {/* Back to Home CTA */}
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          <button className="button primary" onClick={() => navigate('shop')}>
            Browse Verified Catalog
          </button>
        </div>
      </div>
    </div>
  )
}

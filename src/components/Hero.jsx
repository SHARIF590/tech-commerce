import { useCart } from '../context/CartContext'
import ProductIcon from './ProductIcon'

export default function Hero({ onShopNow }) {
  const { addItem } = useCart()

  const quickDeals = [
    { id: 'canva-pro-1year', name: 'Canva Pro 1Y', price: 100, iconType: 'canva', badge: 'HOT' },
    { id: 'gemini-advanced-18m', name: 'Gemini Pro 18M', price: 200, iconType: 'gemini', badge: 'POPULAR' },
    { id: 'windows-11-pro-retail', name: 'Win 11 Pro Retail', price: 750, iconType: 'windows', badge: 'LIFETIME' },
    { id: 'capcut-pro-pc', name: 'CapCut Pro', price: 400, iconType: 'capcut', badge: '4K EXPORT' },
  ]

  return (
    <section id="home" className="hero shell">
      <div className="hero-copy">
        <span style={{ letterSpacing: '0.08em', fontWeight: 800 }}>AUTHORIZED IT RESELLER · EST. 2016</span>
        <h1>
          Authentic Software Licenses &amp; Premium <em>AI Subscriptions</em>
        </h1>
        <p>
          Bangladesh's premier independent IT distributor. Verifiable retail keys, instant WhatsApp &amp; Email voucher dispatch, and guaranteed replacement warranty backed by local support in Dhanmondi-32, Dhaka.
        </p>
        <div className="hero-actions">
          <a
            className="button primary"
            href="#all-products"
            onClick={(e) => {
              e.preventDefault()
              onShopNow()
            }}
          >
            Explore Catalog →
          </a>
          <a
            className="button ghost"
            href="https://wa.me/8801738979790?text=Hello%20Shopno%20IT,%20I%20need%20assistance%20choosing%20software"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Desk
          </a>
        </div>
        <ul>
          <li>✓ Verifiable Retail Keys</li>
          <li>✓ bKash &amp; Nagad Instant</li>
          <li>✓ 100% Replacement Warranty</li>
        </ul>
      </div>

      {/* Right Art Graphic */}
      <div className="hero-art-bg" aria-hidden="true">
        <div className="hero-graphic">
          <div className="hero-graphic-top">
            <div className="hero-dots">
              <span />
              <span />
              <span />
            </div>
            <span className="hero-badge-tag">INSTANT ACTIVATION</span>
          </div>

          <div className="hero-cards-preview">
            {quickDeals.map((deal) => (
              <div
                key={deal.id}
                className="h-prev-card"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  addItem({
                    id: deal.id,
                    name: deal.name,
                    price: deal.price,
                    iconType: deal.iconType,
                    image: deal.image,
                  })
                }
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f8fafc', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <ProductIcon type={deal.iconType} image={deal.image} fill size={20} />
                </div>
                <div>
                  <strong>{deal.name}</strong>
                  <small>৳ {deal.price}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

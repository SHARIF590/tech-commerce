import { useState, useMemo } from 'react'
import { useProducts } from '../context/ProductContext'
import { useRouter } from '../context/RouterContext'
import { useCart } from '../context/CartContext'
import ProductIcon from '../components/ProductIcon'
import ProductCard from '../components/ProductCard'
import { resolveAssetUrl } from '../utils/assets'

export default function ProductDetailPage() {
  const { route, navigate } = useRouter()
  const { products } = useProducts()
  const { addItem, setIsCheckoutOpen } = useCart()
  const [qty, setQty] = useState(1)
  const [activeMedia, setActiveMedia] = useState('poster') // 'poster' or 'logo'

  const product = useMemo(() => {
    return products.find((p) => p.id === route.param) || products[0]
  }, [products, route.param])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 4)
  }, [products, product])

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleBuyNow = () => {
    addItem(product, qty)
    setIsCheckoutOpen(true)
  }

  const handleAddToCart = () => {
    addItem(product, qty)
  }

  const posterImage = product.image || null
  const logoImage = product.logo || (typeof product.iconType === 'string' && product.iconType.startsWith('/') ? product.iconType : null)

  const displayedImage = activeMedia === 'logo' && logoImage ? logoImage : (posterImage || logoImage || product.iconType)

  const hasCustomImage = Boolean(
    displayedImage &&
    (typeof displayedImage === 'string' &&
      (displayedImage.startsWith('data:') ||
       displayedImage.startsWith('http://') ||
       displayedImage.startsWith('https://') ||
       displayedImage.startsWith('blob:') ||
       displayedImage.startsWith('/')))
  )

  const whatsappMessage = encodeURIComponent(
    `Hello Shopno IT, I want to order "${product.name}" for ৳${product.price}. Please provide activation details.`
  )
  const whatsappUrl = `https://wa.me/8801618979790?text=${whatsappMessage}`

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('') }} style={{ color: 'var(--blue)', textDecoration: 'none' }}>
          Home
        </a>
        <span>/</span>
        <a href={`#/category/${product.categoryId || 'all'}`} onClick={(e) => { e.preventDefault(); navigate(`category/${product.categoryId || 'all'}`) }} style={{ color: 'var(--blue)', textDecoration: 'none' }}>
          {product.category}
        </a>
        <span>/</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main 2-Column Product Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 480px) 1fr',
          gap: 40,
          background: '#fff',
          borderRadius: 20,
          border: '1px solid var(--line)',
          padding: 32,
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
          marginBottom: 48,
        }}
      >
        {/* Left Column: Visual & Trust Box */}
        <div>
          {/* Main Display Frame */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 16,
              background: '#f8fafc',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              overflow: 'hidden',
            }}
          >
            {product.badge && <span className="badge">{product.badge}</span>}
            {hasCustomImage ? (
              <ProductIcon
                type={displayedImage}
                image={displayedImage}
                fill
                fit={activeMedia === 'logo' ? 'contain' : 'cover'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: activeMedia === 'logo' ? 'contain' : 'cover',
                  padding: activeMedia === 'logo' ? 48 : 0,
                  background: activeMedia === 'logo' ? '#f1f5f9' : 'transparent',
                }}
              />
            ) : (
              <ProductIcon type={product.iconType} size={120} />
            )}
            <span className="art-brand" style={{ zIndex: 2 }}>SHOPNO IT</span>
          </div>

          {/* Interactive Media Selector (Promotional Poster vs Official Vector Logo) */}
          {(posterImage && logoImage) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => setActiveMedia('poster')}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: activeMedia === 'poster' ? '2px solid var(--blue)' : '1px solid var(--line)',
                  background: activeMedia === 'poster' ? '#eff6ff' : '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  color: activeMedia === 'poster' ? 'var(--blue)' : '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>🖼️ Promotional Poster</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMedia('logo')}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  border: activeMedia === 'logo' ? '2px solid var(--blue)' : '1px solid var(--line)',
                  background: activeMedia === 'logo' ? '#eff6ff' : '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  color: activeMedia === 'logo' ? 'var(--blue)' : '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>⚡ Official Logo</span>
              </button>
            </div>
          )}

          {/* Trust Guarantees Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--green)' }}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span><strong>Delivery:</strong> {product.delivery}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--blue)' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span><strong>Warranty:</strong> {product.warranty}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>🛡️</span>
              <span style={{ color: '#15803d', fontWeight: 700 }}>আগে সার্ভিস, পরে পেমেন্ট সুবিধা প্রযোজ্য</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#ea580c', fontWeight: 800 }}>✓</span>
              <span><strong>Activation:</strong> Direct official server online verification</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', background: '#eff6ff', padding: '4px 10px', borderRadius: 20 }}>
              {product.category}
            </span>
            {logoImage && (
              <img src={resolveAssetUrl(logoImage)} alt="Logo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            )}
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', margin: '0 0 12px', lineHeight: 1.3 }}>
            {product.name}
          </h1>

          {/* Pricing Box */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '8px 0 16px' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#1d4ed8' }}>
              ৳ {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <del style={{ fontSize: 16, color: '#98a4b6' }}>
                  ৳ {product.originalPrice.toLocaleString()}
                </del>
                <span
                  style={{
                    background: '#fef2f2',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stock and Live Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, fontSize: 12, fontWeight: 700 }}>
            <span style={{ color: '#16a34a' }}>● {product.stock} Units In Stock</span>
            <span style={{ color: '#c2410c' }}>Verified Orders: {product.sold} in Bangladesh</span>
          </div>

          <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, marginBottom: 24 }}>
            {product.longDesc || product.desc}
          </p>

          {/* Quantity & Actions Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #cbd5e1',
                borderRadius: 9,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: 36, height: 44, border: 'none', background: '#f8fafc', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}
              >
                −
              </button>
              <span style={{ width: 44, textAlign: 'center', fontWeight: 800, fontSize: 15 }}>
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                style={{ width: 36, height: 44, border: 'none', background: '#f8fafc', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="button primary"
              onClick={handleBuyNow}
              style={{ minHeight: 46, padding: '0 24px', fontSize: 14, fontWeight: 800 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ marginRight: 6 }}>
                <path d="M17 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.17 14.75L7.2 14.6l.9-1.6H17c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0021.46 4H5.21L4.27 2H1v2h2l3.6 7.59L5.25 14c-.16.28-.25.61-.25.94C5 16.1 5.9 17 7 17h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
              </svg>
              Buy Now (৳{(product.price * qty).toLocaleString()})
            </button>

            <button
              type="button"
              className="button ghost"
              onClick={handleAddToCart}
              style={{ minHeight: 46, padding: '0 18px', color: '#1e293b', borderColor: '#cbd5e1' }}
            >
              Add to Cart
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                minHeight: 46,
                padding: '0 18px',
                background: '#25D366',
                color: '#fff',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <span>💬 WhatsApp Order</span>
            </a>
          </div>

          {/* Key Features List */}
          {product.features && (
            <div style={{ marginBottom: 24, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 12 }}>
                Key Features &amp; Inclusions:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {product.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#334155' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step-by-Step Activation Guide */}
          {product.activationSteps && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 18, marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1e40af', margin: '0 0 10px', textTransform: 'uppercase' }}>
                How Activation Works in Bangladesh:
              </h3>
              <ol style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: '#1e3a8a' }}>
                {product.activationSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* System Requirements */}
          {product.systemRequirements && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
              <strong>Compatibility:</strong> {product.systemRequirements}
            </div>
          )}

          {/* Nominative Fair Use & Reseller Guarantee Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 16,
              fontSize: 11.5,
              color: '#64748b',
              lineHeight: 1.6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--blue)' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Reseller Guarantee &amp; Nominative Fair Use Notice</span>
            </div>
            <div>
              Shopno IT Limited provides genuine digital access vouchers and original retail keys. All brand names, logos, and registered trademarks belong to their respective copyright holders. Citation of <em>{product.name}</em> is used strictly under nominative fair use for compatibility and voucher delivery. Backed by our official replacement warranty.
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="section-heading" style={{ marginBottom: 20 }}>
            <h2>Related Products</h2>
            <a onClick={() => navigate('shop')} style={{ cursor: 'pointer' }}>View All</a>
          </div>
          <div className="products">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

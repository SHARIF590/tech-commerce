import { useCart } from '../context/CartContext'
import { useRouter } from '../context/RouterContext'
import ProductIcon from './ProductIcon'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { navigate } = useRouter()

  const handleBuyNow = (e) => {
    e.stopPropagation()
    addItem(product, 1)
  }

  const handleOpenDetail = (e) => {
    e.preventDefault()
    navigate(`product/${product.id}`)
  }

  const hasCustomImage = Boolean(
    product.image ||
    (typeof product.iconType === 'string' &&
      (product.iconType.startsWith('data:') ||
       product.iconType.startsWith('http://') ||
       product.iconType.startsWith('https://') ||
       product.iconType.startsWith('blob:') ||
       product.iconType.startsWith('/')))
  )

  return (
    <article className="product-card" onClick={handleOpenDetail}>
      <div className={`product-art ${hasCustomImage ? 'has-custom-image' : ''}`}>
        {product.badge && <span className="badge">{product.badge}</span>}
        {hasCustomImage ? (
          <ProductIcon
            type={product.iconType}
            image={product.image}
            fill
            fit="cover"
            className="product-card-cover-img"
          />
        ) : (
          <div className="product-art-vector">
            <ProductIcon type={product.iconType} size={64} />
          </div>
        )}
        <span className="art-brand">SHOPNO IT</span>
      </div>

      <div className="product-copy">
        <small>{product.category}</small>
        <h3>
          <a href={`#/product/${product.id}`} onClick={handleOpenDetail}>
            {product.name}
          </a>
        </h3>

        <div className="price">
          <strong>৳ {product.price.toLocaleString()}</strong>
          {product.originalPrice > product.price && (
            <del>৳ {product.originalPrice.toLocaleString()}</del>
          )}
        </div>

        {product.stock && (
          <div className="stock-sold-row">
            <span style={{ color: '#16a34a' }}>● {product.stock} In Stock</span>
            <span style={{ color: 'var(--muted)', fontSize: 11 }}>Verified Key</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 38px', gap: 6, marginTop: 10 }}>
          <button type="button" className="pc-btn pc-btn-buy" onClick={handleBuyNow}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M17 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.17 14.75L7.2 14.6l.9-1.6H17c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0021.46 4H5.21L4.27 2H1v2h2l3.6 7.59L5.25 14c-.16.28-.25.61-.25.94C5 16.1 5.9 17 7 17h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
            </svg>
            Instant Order
          </button>

          <a
            href={`https://wa.me/8801738979790?text=Hello%20Shopno%20IT,%20I%20have%20a%20question%20about%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Ask on WhatsApp"
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16a34a',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}

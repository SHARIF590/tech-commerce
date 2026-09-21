import { useMemo } from 'react'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import { useRouter } from '../context/RouterContext'

export default function CategoryPage() {
  const { route, navigate } = useRouter()
  const { products, categories } = useProducts()
  const catId = route.param || 'ai-services'

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === catId) || categories[0] || { name: 'Category', accent: '#2563eb' }
  }, [categories, catId])

  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.categoryId === catId)
  }, [products, catId])

  return (
    <div>
      {/* Page Header */}
      <div className="page-head" style={{ background: `linear-gradient(135deg, #07142d 0%, #0d2550 55%, ${currentCategory.accent || '#2563eb'}3d 100%)` }}>
        <div className="shell">
          <span>CATEGORY ARCHIVE</span>
          <h1>{currentCategory.name}</h1>
          <p>
            Browse verified {currentCategory.name} products with instant email delivery and replacement warranty in Bangladesh.
          </p>
        </div>
      </div>

      <div className="shell" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>
          <a onClick={() => navigate('home')} style={{ cursor: 'pointer', color: 'var(--blue)' }}>Home</a>
          <span>/</span>
          <a onClick={() => navigate('shop')} style={{ cursor: 'pointer', color: 'var(--blue)' }}>Categories</a>
          <span>/</span>
          <strong style={{ color: 'var(--ink)' }}>{currentCategory.name}</strong>
        </div>

        {categoryProducts.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', padding: 48, textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px' }}>No items currently listed in this category</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
              Check back shortly or contact our WhatsApp support for custom availability.
            </p>
            <button className="button primary" onClick={() => navigate('shop')}>
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="products">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

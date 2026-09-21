import { useState, useMemo } from 'react'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import { useRouter } from '../context/RouterContext'

export default function ShopPage() {
  const { route, navigate } = useRouter()
  const { products, categories } = useProducts()
  const [selectedCat, setSelectedCat] = useState(route.category || 'all')
  const [search, setSearch] = useState(route.query || '')
  const [sortBy, setSortBy] = useState('featured')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCat !== 'all' && p.categoryId !== selectedCat) {
        return false
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchName = p.name.toLowerCase().includes(q)
        const matchCat = p.category.toLowerCase().includes(q)
        const matchDesc = p.desc?.toLowerCase().includes(q)
        return matchName || matchCat || matchDesc
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'popular') return b.sold - a.sold
      return 0
    })
  }, [selectedCat, search, sortBy])

  return (
    <div>
      {/* Page Header */}
      <div className="page-head">
        <div className="shell">
          <span>STORE CATALOG</span>
          <h1>All Products</h1>
          <p>Genuine software licenses, subscriptions, and cloud services in Bangladesh.</p>
        </div>
      </div>

      {/* Shop Layout */}
      <div className="shop-layout shell">
        {/* Sidebar Filters */}
        <aside>
          <h2>Categories</h2>
          <a
            className={selectedCat === 'all' ? 'active-filter' : ''}
            onClick={() => setSelectedCat('all')}
            style={{ cursor: 'pointer', fontWeight: selectedCat === 'all' ? 700 : 500 }}
          >
            All Products ({products.length})
          </a>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length
            return (
              <a
                key={cat.id}
                className={selectedCat === cat.id ? 'active-filter' : ''}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  cursor: 'pointer',
                  fontWeight: selectedCat === cat.id ? 700 : 500,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{cat.name}</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{count}</span>
              </a>
            )
          })}

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <h2>Support Desk</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
              Need a custom software volume license?
            </p>
            <a
              href="https://wa.me/8801738979790"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 14px',
                background: '#25d366',
                color: '#fff',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              WhatsApp 01738-979790
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <div>
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 20,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
              <input
                type="search"
                placeholder="Search within products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: 320,
                  padding: '9px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 10px',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="featured">Featured</option>
                <option value="popular">Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div
              style={{
                background: '#fff',
                borderRadius: 14,
                border: '1px solid var(--line)',
                padding: '48px 24px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ margin: '0 0 8px', fontSize: 18, color: 'var(--ink)' }}>No products found</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 16px' }}>
                We could not find any products matching your criteria.
              </p>
              <button
                className="button primary"
                onClick={() => {
                  setSelectedCat('all')
                  setSearch('')
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

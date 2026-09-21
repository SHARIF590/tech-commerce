import { useState } from 'react'
import { BD_CATEGORIES } from '../data/products'
import { useProducts } from '../context/ProductContext'
import CategoryIcon from './CategoryIcon'

export default function CategoryStrip({ activeCategory, onSelectCategory }) {
  const { categories = BD_CATEGORIES } = useProducts()
  const [isExpanded, setIsExpanded] = useState(false)

  const catList = categories && categories.length > 0 ? categories : BD_CATEGORIES

  // In minimal view, show top 5 items + "More" card (total 6 items = 1 clean row on desktop)
  const LIMIT = 5
  const hasMore = catList.length > LIMIT
  const visibleCategories = isExpanded || !hasMore ? catList : catList.slice(0, LIMIT)
  const hiddenCount = catList.length - LIMIT

  return (
    <section className="section shell">
      <div className="center-heading">
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Shop by Categories</h2>
          {hasMore && (
            <button
              type="button"
              className="cat-strip-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse to minimal view' : `View all ${catList.length} categories`}
            >
              <span>{isExpanded ? 'Show Minimal ▴' : `View All (${catList.length}) ▾`}</span>
            </button>
          )}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>
          Select a category to filter genuine software licenses &amp; digital accounts
        </p>
      </div>

      <div className="category-strip">
        {visibleCategories.map((cat) => (
          <a
            key={cat.id}
            className={activeCategory === cat.id ? 'active-cat' : ''}
            style={{ '--accent': cat.accent || '#2563eb' }}
            onClick={(e) => {
              e.preventDefault()
              onSelectCategory(cat.id)
              const el = document.getElementById('all-products')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <span>
              <CategoryIcon category={cat} />
            </span>
            <strong>{cat.name}</strong>
          </a>
        ))}

        {/* The "More" Card to maintain minimal and clean view */}
        {hasMore && !isExpanded && (
          <a
            className="more-cat-card"
            style={{ '--accent': '#2563eb' }}
            onClick={(e) => {
              e.preventDefault()
              setIsExpanded(true)
            }}
            title={`View all ${catList.length} categories`}
          >
            <span>
              <CategoryIcon iconType="more" />
            </span>
            <strong>
              More ({hiddenCount}+)
              <small style={{ display: 'block', fontSize: 10, color: 'var(--blue)', fontWeight: 600, marginTop: 1 }}>
                View All
              </small>
            </strong>
          </a>
        )}

        {/* When expanded, provide a collapse card at the end */}
        {hasMore && isExpanded && (
          <a
            className="more-cat-card"
            style={{ '--accent': '#64748b' }}
            onClick={(e) => {
              e.preventDefault()
              setIsExpanded(false)
            }}
            title="Collapse to minimal view"
          >
            <span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </span>
            <strong>
              Show Less ▴
              <small style={{ display: 'block', fontSize: 10, color: '#64748b', fontWeight: 600, marginTop: 1 }}>
                Minimal View
              </small>
            </strong>
          </a>
        )}
      </div>
    </section>
  )
}

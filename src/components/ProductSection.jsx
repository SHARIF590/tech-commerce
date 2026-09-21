import ProductCard from './ProductCard'

export default function ProductSection({ title, products, onViewAll, viewAllText = 'View All Products' }) {
  if (!products || products.length === 0) return null

  return (
    <section className="section shell" id="all-products">
      <div className="section-heading">
        <h2>{title}</h2>
        {onViewAll && (
          <a
            href="#all"
            onClick={(e) => {
              e.preventDefault()
              onViewAll()
            }}
          >
            {viewAllText}
          </a>
        )}
      </div>

      <div className="products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

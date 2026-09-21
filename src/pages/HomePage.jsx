import Hero from '../components/Hero'
import NoticeBar from '../components/NoticeBar'
import CategoryStrip from '../components/CategoryStrip'
import ProductSection from '../components/ProductSection'
import SupportBanner from '../components/SupportBanner'
import BenefitsSection from '../components/BenefitsSection'
import { useProducts } from '../context/ProductContext'
import { useRouter } from '../context/RouterContext'

export default function HomePage() {
  const { navigate } = useRouter()
  const { products } = useProducts()

  const bestOffers = products.slice(0, 4)
  const newProducts = products.slice(4, 12)

  return (
    <>
      <Hero onShopNow={() => navigate('shop')} />
      <NoticeBar />
      <CategoryStrip onSelectCategory={(catId) => navigate(`category/${catId}`)} />
      
      <ProductSection
        title="The Best Offers"
        products={bestOffers}
        onViewAll={() => navigate('shop')}
        viewAllText="View All Products"
      />

      <SupportBanner />

      <ProductSection
        title="New Product"
        products={newProducts}
        onViewAll={() => navigate('shop')}
        viewAllText="View Full Store"
      />

      <BenefitsSection />
    </>
  )
}

import CartProvider from './context/CartContext'
import ProductProvider from './context/ProductContext'
import { RouterProvider, useRouter } from './context/RouterContext'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import MobileNav from './components/MobileNav'
import FloatingWA from './components/FloatingWA'
import CartPopup from './components/CartPopup'
import LiveSaleToast from './components/LiveSaleToast'
import TrackOrderModal from './components/TrackOrderModal'
import CheckoutModal from './components/CheckoutModal'

// Page Components
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import TrackOrderPage from './pages/TrackOrderPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LegalPage from './pages/LegalPage'
import AdminPage from './pages/AdminPage'

function AppContent() {
  const { route } = useRouter()

  // Dedicated Enterprise Admin Management Console
  if (route.page === 'admin') {
    return <AdminPage />
  }

  const renderActivePage = () => {
    switch (route.page) {
      case 'shop':
        return <ShopPage />
      case 'category':
        return <CategoryPage />
      case 'product':
        return <ProductDetailPage />
      case 'cart':
        return <CartPage />
      case 'checkout':
        return <CheckoutPage />
      case 'track-order':
        return <TrackOrderPage />
      case 'about':
        return <AboutPage />
      case 'contact':
        return <ContactPage />
      case 'legal':
        return <LegalPage />
      case 'admin':
        return <AdminPage />
      case 'home':
      default:
        return <HomePage />
    }
  }

  return (
    <>
      {/* Two-Tier Site Header */}
      <SiteHeader />

      {/* Main Routed Page Container */}
      <main id="main-content">
        {renderActivePage()}
      </main>

      {/* Site Footer */}
      <SiteFooter />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Pulsing WhatsApp Button */}
      <FloatingWA />

      {/* Bottom Sheet Cart Modal */}
      <CartPopup />

      {/* Live Sales Notification Toast */}
      <LiveSaleToast />

      {/* Global Modals */}
      <TrackOrderModal />
      <CheckoutModal />
    </>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <ProductProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ProductProvider>
    </RouterProvider>
  )
}

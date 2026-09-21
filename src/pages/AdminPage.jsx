import { useState, useEffect, useCallback, useRef } from 'react'
import { useProducts } from '../context/ProductContext'
import { useRouter } from '../context/RouterContext'

// Sub-components of the modern dashboard management system
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import DashboardOverview from '../components/admin/DashboardOverview'
import OrdersManager from '../components/admin/OrdersManager'
import ProductsManager from '../components/admin/ProductsManager'
import CategoriesManager from '../components/admin/CategoriesManager'
import CouponsManager from '../components/admin/CouponsManager'
import InquiriesManager from '../components/admin/InquiriesManager'
import SecurityCenter from '../components/admin/SecurityCenter'
import BackupSettingsManager from '../components/admin/BackupSettingsManager'
import AdminAuthModal from '../components/admin/AdminAuthModal'
import InventoryManager from '../components/admin/InventoryManager'

export default function AdminPage() {
  const {
    products,
    categories,
    orders,
    coupons,
    inquiries,
    storeSettings,
    auditLogs,
    logAuditEvent,
    clearAuditLogs,
    verifyAdminPin,
    updateAdminPin,
    lockoutUntil,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    addCategory,
    deleteCategory,
    updateOrderStatus,
    deleteOrder,
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    updateInquiryStatus,
    deleteInquiry,
    updateStoreSettings,
    exportSystemBackup,
    importSystemBackup,
    resetToDefaults,
  } = useProducts()

  const { navigate } = useRouter()

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('shopno_admin_authed') === 'true'
  })

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview')

  // Sidebar Layout State
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Product Add/Edit Modal trigger
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  // Inactivity Auto-Lock Timer (Security Hardening)
  const idleTimerRef = useRef(null)
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (!isAuthenticated) return

    const minutes = storeSettings?.autoLockMinutes || 15
    idleTimerRef.current = setTimeout(() => {
      setIsAuthenticated(false)
      sessionStorage.removeItem('shopno_admin_authed')
      logAuditEvent('SESSION_TIMEOUT', `Admin session locked after ${minutes} minutes of inactivity.`, 'warning')
    }, minutes * 60 * 1000)
  }, [isAuthenticated, storeSettings?.autoLockMinutes, logAuditEvent])

  // Track user activity for auto-lock
  useEffect(() => {
    if (!isAuthenticated) return
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']
    activityEvents.forEach((ev) => window.addEventListener(ev, resetIdleTimer))
    resetIdleTimer()

    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetIdleTimer))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [isAuthenticated, resetIdleTimer])

  // Login handler
  const handleAuthenticated = () => {
    setIsAuthenticated(true)
    sessionStorage.setItem('shopno_admin_authed', 'true')
  }

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('shopno_admin_authed')
    logAuditEvent('ADMIN_LOGOUT', 'Administrator explicitly locked portal.')
  }

  // Unauthenticated: Show Cryptographically Guarded Login Gate
  if (!isAuthenticated) {
    return (
      <AdminAuthModal
        onAuthenticate={handleAuthenticated}
        onReturnToStore={() => navigate('home')}
        lockoutUntil={lockoutUntil}
        verifyAdminPin={verifyAdminPin}
      />
    )
  }

  // Badges and counts for the sidebar
  const counts = {
    orders: orders.filter((o) => o.status === 'pending').length,
    products: products.length,
    coupons: coupons.filter((c) => c.active).length,
    inquiries: inquiries.filter((i) => i.status === 'new').length,
    highAlert: auditLogs.some((l) => l.severity === 'danger'),
    lowStock: products.filter((p) => Number(p.stock) <= 5).length,
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Modern Collapsible Enterprise Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={handleLogout}
        onViewStore={() => navigate('shop')}
        counts={counts}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Administrative Workstation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Top Header Command Bar */}
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileNav={() => setMobileOpen(true)}
          onLogout={handleLogout}
          onViewStore={() => navigate('shop')}
          onNavigateTab={setActiveTab}
          auditLogs={auditLogs}
          orders={orders}
          inquiries={inquiries}
          autoLockMinutes={storeSettings?.autoLockMinutes || 15}
        />

        {/* Tab Content Rendering */}
        <div style={{ padding: '24px 28px', flex: 1 }}>
          {activeTab === 'overview' && (
            <DashboardOverview
              products={products}
              orders={orders}
              inquiries={inquiries}
              auditLogs={auditLogs}
              onNavigateTab={setActiveTab}
              onOpenAddProduct={() => {
                setActiveTab('products')
                setIsProductModalOpen(true)
              }}
              onUpdateOrderStatus={updateOrderStatus}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersManager
              orders={orders}
              onUpdateStatus={updateOrderStatus}
              onDeleteOrder={deleteOrder}
            />
          )}

          {activeTab === 'products' && (
            <ProductsManager
              products={products}
              categories={categories}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
              onToggleStock={toggleStock}
              isModalOpen={isProductModalOpen}
              setIsModalOpen={setIsProductModalOpen}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryManager
              products={products}
              orders={orders}
              onUpdateProduct={updateProduct}
              onLogAuditEvent={logAuditEvent}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesManager
              categories={categories}
              products={products}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
            />
          )}

          {activeTab === 'coupons' && (
            <CouponsManager
              coupons={coupons}
              onAddCoupon={addCoupon}
              onToggleCoupon={toggleCoupon}
              onDeleteCoupon={deleteCoupon}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesManager
              inquiries={inquiries}
              onUpdateStatus={updateInquiryStatus}
              onDeleteInquiry={deleteInquiry}
            />
          )}

          {activeTab === 'security' && (
            <SecurityCenter
              auditLogs={auditLogs}
              onUpdatePin={updateAdminPin}
              onClearLogs={clearAuditLogs}
              storeSettings={storeSettings}
              onUpdateStoreSettings={updateStoreSettings}
            />
          )}

          {activeTab === 'backups' && (
            <BackupSettingsManager
              storeSettings={storeSettings}
              onUpdateStoreSettings={updateStoreSettings}
              onExportBackup={exportSystemBackup}
              onImportBackup={importSystemBackup}
              onResetToDefaults={resetToDefaults}
              productCount={products.length}
            />
          )}

          {activeTab === 'settings' && (
            <BackupSettingsManager
              storeSettings={storeSettings}
              onUpdateStoreSettings={updateStoreSettings}
              onExportBackup={exportSystemBackup}
              onImportBackup={importSystemBackup}
              onResetToDefaults={resetToDefaults}
              productCount={products.length}
            />
          )}
        </div>
      </div>
    </div>
  )
}

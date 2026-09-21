import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Tag,
  MessageSquare,
  ShieldCheck,
  Database,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Warehouse,
} from 'lucide-react'

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onLogout,
  onViewStore,
  counts = {},
  mobileOpen = false,
  setMobileOpen,
}) {
  const menuItems = [
    {
      group: 'Core Management',
      items: [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders & Sales', icon: ShoppingBag, badge: counts.orders || 0, badgeColor: '#3b82f6' },
        { id: 'products', label: 'Product Catalog', icon: Package, badge: counts.products || 0 },
        { id: 'inventory', label: 'Inventory Tracking', icon: Warehouse, badge: counts.lowStock || 0, badgeColor: counts.lowStock > 0 ? '#f59e0b' : undefined },
        { id: 'categories', label: 'Categories', icon: FolderTree },
      ],
    },
    {
      group: 'Marketing & CRM',
      items: [
        { id: 'coupons', label: 'Coupons & Offers', icon: Tag, badge: counts.coupons || 0 },
        { id: 'inquiries', label: 'Customer Leads CRM', icon: MessageSquare, badge: counts.inquiries || 0, badgeColor: '#f59e0b' },
      ],
    },
    {
      group: 'Security & Operations',
      items: [
        { id: 'security', label: 'Security Center', icon: ShieldCheck, badge: counts.highAlert ? 'ALERTS' : null, badgeColor: '#ef4444' },
        { id: 'backups', label: 'Backup & Restore', icon: Database },
        { id: 'settings', label: 'Store Settings', icon: Settings },
      ],
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 900,
          }}
        />
      )}

      <aside
        style={{
          width: collapsed ? 80 : 270,
          minWidth: collapsed ? 80 : 270,
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          background: '#0f172a',
          color: '#f8fafc',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 950,
          userSelect: 'none',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
        }}
        className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '0 12px' : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: 18,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                flexShrink: 0,
              }}
            >
              S
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em', whiteSpace: 'nowrap', color: '#fff' }}>
                  Shopno IT
                </div>
                <div style={{ fontSize: 10.5, color: '#38bdf8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Enterprise Admin
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
                borderRadius: 6,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Collapsed expander button */}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <button
              onClick={() => setCollapsed(false)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
                borderRadius: 6,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation Section Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '12px 8px' : '16px 14px' }}>
          {menuItems.map((grp, gIdx) => (
            <div key={gIdx} style={{ marginBottom: 20 }}>
              {!collapsed && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0 10px 8px',
                  }}
                >
                  {grp.group}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {grp.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        if (setMobileOpen) setMobileOpen(false)
                      }}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        width: '100%',
                        padding: collapsed ? '11px 0' : '9px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: isActive ? 'linear-gradient(90deg, #1e40af, #2563eb)' : 'transparent',
                        color: isActive ? '#ffffff' : '#94a3b8',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                          e.currentTarget.style.color = '#f1f5f9'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#94a3b8'
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Icon size={18} color={isActive ? '#60a5fa' : '#94a3b8'} />
                        {!collapsed && <span>{item.label}</span>}
                      </div>

                      {!collapsed && item.badge !== undefined && item.badge !== null && (
                        <span
                          style={{
                            background: item.badgeColor || '#334155',
                            color: '#fff',
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: 99,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Dot for collapsed badge */}
                      {collapsed && item.badge > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 6,
                            right: 8,
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: item.badgeColor || '#3b82f6',
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Security Shield & Status Pill */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', background: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              style={{
                background: 'rgba(37, 99, 235, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: '#10b981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>
                  Shield Protected
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  SHA-256 &amp; Brute-Force Rate Limiting Active
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Utility Actions */}
        <div
          style={{
            padding: collapsed ? '12px 8px' : '14px 16px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <button
            onClick={onViewStore}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
              width: '100%',
              padding: '8px 10px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent',
              color: '#38bdf8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Open storefront in customer view"
          >
            <ExternalLink size={15} />
            {!collapsed && <span>View Live Store</span>}
          </button>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
              width: '100%',
              padding: '8px 10px',
              borderRadius: 6,
              border: 'none',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Lock and logout of admin portal"
          >
            <LogOut size={15} />
            {!collapsed && <span>Lock Portal</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

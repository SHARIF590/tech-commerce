import { useState, useEffect } from 'react'
import {
  Menu,
  Bell,
  ShieldCheck,
  Clock,
  ExternalLink,
  RefreshCw,
  LogOut,
} from 'lucide-react'

export default function AdminHeader({
  activeTab,
  onOpenMobileNav,
  onLogout,
  onViewStore,
  onNavigateTab,
  auditLogs = [],
  orders = [],
  inquiries = [],
}) {
  const [timeStr, setTimeStr] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Live BST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' BST'
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Titles dictionary
  const titleMap = {
    overview: { title: 'Executive Overview', desc: 'Real-time sales velocity, revenue metrics & store health' },
    orders: { title: 'Orders & Fulfillment Pipeline', desc: 'Manage customer purchases, verify bKash/Nagad TrxIDs & generate invoices' },
    products: { title: 'Product & License Catalog', desc: 'Add new software subscriptions, update pricing & manage live stocks' },
    inventory: { title: 'Inventory Control Center', desc: 'Real-time stock levels, movement logs, low-stock alerts & restock management' },
    categories: { title: 'Categories & Taxonomies', desc: 'Organize software items into customer-facing storefront departments' },
    coupons: { title: 'Coupons & Promotional Discounter', desc: 'Configure instant savings codes & discount campaigns' },
    inquiries: { title: 'Customer Leads & CRM Inbox', desc: 'Direct WhatsApp and email queries submitted from the Contact desk' },
    security: { title: 'Security Center & Hacker Protection', desc: 'SHA-256 access control, brute-force rate limiter & audit trail' },
    backups: { title: 'Data Synchronization & Backups', desc: 'Export full JSON store snapshots, restore catalogs & system state' },
    settings: { title: 'Store Identity & Operation Settings', desc: 'WhatsApp support numbers, notice broadcasts & operational toggles' },
  }

  const current = titleMap[activeTab] || { title: 'Administration', desc: 'Store management console' }

  // Notifications summary
  const unreadOrders = orders.filter((o) => o.status === 'pending')
  const newInquiries = inquiries.filter((i) => i.status === 'new')
  const securityWarnings = auditLogs.filter((l) => l.severity === 'warning' || l.severity === 'danger')
  const notificationCount = unreadOrders.length + newInquiries.length + securityWarnings.slice(0, 3).length

  return (
    <header
      style={{
        height: 70,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onOpenMobileNav}
          className="admin-mobile-toggle"
          style={{
            display: 'none',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: 8,
            cursor: 'pointer',
            color: '#334155',
          }}
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Shopno IT Manager
            </span>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
              {activeTab}
            </span>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '2px 0 0', letterSpacing: '-0.02em' }}>
            {current.title}
          </h1>
        </div>
      </div>

      {/* Right: Live Clock, Security Pill, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Live BST Clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 99,
            padding: '5px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: '#475569',
          }}
          title="Current Dhaka, Bangladesh Local Time"
        >
          <Clock size={14} color="#2563eb" />
          <span>{timeStr || 'Connecting...'}</span>
        </div>

        {/* Security Shield Status Badge */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('security')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 99,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 700,
            color: '#065f46',
            cursor: 'pointer',
          }}
          title="Hacker Defense Active: SHA-256 Hashing, Rate Limiting & Audit Logger"
        >
          <ShieldCheck size={14} color="#059669" />
          <span className="hide-on-mobile">Protected</span>
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              position: 'relative',
            }}
            title="Notifications & Alerts"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 800,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 48,
                right: 0,
                width: 320,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                border: '1px solid #e2e8f0',
                padding: 16,
                zIndex: 999,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: 13, color: '#0f172a' }}>Live System Alerts</strong>
                <span style={{ fontSize: 11, color: '#64748b' }}>{notificationCount} pending</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
                {unreadOrders.length > 0 && (
                  <div
                    onClick={() => {
                      onNavigateTab('orders')
                      setShowNotifications(false)
                    }}
                    style={{
                      background: '#eff6ff',
                      borderRadius: 8,
                      padding: 10,
                      cursor: 'pointer',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>
                      ⚡ {unreadOrders.length} New Unverified Orders
                    </div>
                    <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 2 }}>
                      Awaiting bKash/Nagad TrxID verification
                    </div>
                  </div>
                )}

                {newInquiries.length > 0 && (
                  <div
                    onClick={() => {
                      onNavigateTab('inquiries')
                      setShowNotifications(false)
                    }}
                    style={{
                      background: '#fffbeb',
                      borderRadius: 8,
                      padding: 10,
                      cursor: 'pointer',
                      border: '1px solid #fde68a',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#b45309' }}>
                      💬 {newInquiries.length} New Customer Inquiry
                    </div>
                    <div style={{ fontSize: 11, color: '#d97706', marginTop: 2 }}>
                      Recent contact request awaiting WhatsApp reply
                    </div>
                  </div>
                )}

                {securityWarnings.slice(0, 2).map((warn) => (
                  <div
                    key={warn.id}
                    onClick={() => {
                      onNavigateTab('security')
                      setShowNotifications(false)
                    }}
                    style={{
                      background: '#fef2f2',
                      borderRadius: 8,
                      padding: 10,
                      cursor: 'pointer',
                      border: '1px solid #fecaca',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>
                      🛡️ {warn.action}
                    </div>
                    <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>
                      {warn.detail}
                    </div>
                  </div>
                ))}

                {notificationCount === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: 12 }}>
                    ✓ All clear! No pending alerts or security incidents.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Storefront Quick Button */}
        <button
          onClick={onViewStore}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 12px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#1e293b',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Open live storefront"
        >
          <ExternalLink size={14} color="#2563eb" />
          <span className="hide-on-mobile">Storefront</span>
        </button>

        {/* Admin Profile & Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px 4px 6px',
              borderRadius: 99,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              A
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }} className="hide-on-mobile">
              Admin
            </span>
          </button>

          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                width: 200,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 15px 35px rgba(15, 23, 42, 0.12)',
                border: '1px solid #e2e8f0',
                padding: '8px 6px',
                zIndex: 999,
              }}
            >
              <button
                onClick={() => {
                  onNavigateTab('security')
                  setShowUserMenu(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: '#334155',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <ShieldCheck size={15} color="#2563eb" />
                Change Passcode
              </button>

              <button
                onClick={() => {
                  onNavigateTab('backups')
                  setShowUserMenu(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: '#334155',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <RefreshCw size={15} color="#059669" />
                Backup System
              </button>

              <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />

              <button
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#ef4444',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={15} />
                Lock &amp; Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

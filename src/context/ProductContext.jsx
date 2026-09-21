import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { BD_PRODUCTS, BD_CATEGORIES } from '../data/products'
import { hashString, sanitizeInput, sanitizeObject, getClientFingerprint } from '../utils/security'

const ProductContext = createContext(null)

const PRODUCTS_STORAGE_KEY = 'shopno_it_products_v5'
const CATEGORIES_STORAGE_KEY = 'shopno_it_categories_v6'
const ORDERS_STORAGE_KEY = 'shopno_it_orders_v5'
const INQUIRIES_STORAGE_KEY = 'shopno_it_inquiries_v5'
const COUPONS_STORAGE_KEY = 'shopno_it_coupons_v5'
const SETTINGS_STORAGE_KEY = 'shopno_it_settings_v5'
const AUDIT_STORAGE_KEY = 'shopno_it_audit_logs_v5'
const ADMIN_PIN_HASH_KEY = 'shopno_it_admin_pin_hash'
const LOCKOUT_STORAGE_KEY = 'shopno_it_lockout_until'
const FAILED_ATTEMPTS_KEY = 'shopno_it_failed_attempts'
const INVENTORY_MOVEMENTS_KEY = 'shopno_it_inventory_movements_v1'

// Default PIN is "shopno2026"
const DEFAULT_PIN = 'shopno2026'

const INITIAL_ORDERS = [
  {
    orderId: 'SIT-849201',
    customer: {
      name: 'Rahim Uddin',
      email: 'rahim.tech@gmail.com',
      phone: '01712-345678',
      paymentMethod: 'bkash',
      trxId: '9K28FX019A',
      senderNumber: '01712345678',
      notes: 'Need fast delivery for office graphic designer workstation.',
    },
    items: [
      { id: 'canva-pro-1y', name: 'Canva Pro (1 Year Private Access)', price: 499, qty: 1, category: 'AI & Creative Tools' },
      { id: 'win-11-pro', name: 'Windows 11 Pro Retail License Key', price: 650, qty: 1, category: 'Operating Systems' },
    ],
    total: 1149,
    status: 'completed', // 'pending' | 'verified' | 'processing' | 'completed' | 'cancelled'
    date: '2026-09-21 10:15 AM',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    orderId: 'SIT-752109',
    customer: {
      name: 'Tanvir Ahmed',
      email: 'tanvir.agency@yahoo.com',
      phone: '01844-998877',
      paymentMethod: 'nagad',
      trxId: 'NGD891102C',
      senderNumber: '01844998877',
      notes: 'Please send credentials on WhatsApp directly.',
    },
    items: [
      { id: 'gemini-advanced', name: 'Google Gemini Advanced (1 Month Private)', price: 450, qty: 2, category: 'AI & Creative Tools' },
    ],
    total: 900,
    status: 'verified',
    date: '2026-09-21 11:05 AM',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    orderId: 'SIT-618402',
    customer: {
      name: 'Farzana Haque',
      email: 'farzana.design@outlook.com',
      phone: '01911-223344',
      paymentMethod: 'bkash',
      trxId: 'BK889100Z',
      senderNumber: '01911223344',
      notes: 'Urgent setup for university project video editing.',
    },
    items: [
      { id: 'capcut-pro', name: 'CapCut Pro (1 Year Private Account)', price: 699, qty: 1, category: 'Video Editing' },
    ],
    total: 699,
    status: 'pending',
    date: '2026-09-21 11:38 AM',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
]

const INITIAL_COUPONS = [
  { id: 'cpn-1', code: 'SHOPNO5', discountPercent: 5, active: true, usageCount: 42, description: 'Welcome 5% off on all digital vouchers' },
  { id: 'cpn-2', code: 'FESTIVE10', discountPercent: 10, active: true, usageCount: 18, description: 'Festive season 10% discount on software' },
]

const INITIAL_INQUIRIES = [
  {
    id: 'inq-101',
    name: 'Sabbir Hossain',
    email: 'sabbir.corp@gmail.com',
    phone: '01799-887766',
    subject: 'Corporate Bulk Licenses (50 Canva Seats)',
    message: 'We are a digital marketing agency in Dhaka looking to purchase 50 Canva Pro seats and 10 Office 365 enterprise licenses with official VAT invoice. Please share pricing.',
    status: 'new', // 'new' | 'contacted' | 'resolved'
    date: 'Today, 09:30 AM',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'inq-102',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@hotmail.com',
    phone: '01622-334455',
    subject: 'NordVPN Setup Help',
    message: 'Can I use the NordVPN account on both my Windows laptop and Android phone simultaneously?',
    status: 'contacted',
    date: 'Yesterday, 04:15 PM',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const INITIAL_SETTINGS = {
  storeName: 'Shopno IT Limited',
  tagline: 'Leading Digital License & Software Subscription Platform in Bangladesh',
  supportPhone: '+88 01618-979790',
  supportWhatsApp: '+88 01618-979790',
  supportEmail: 'support@shopnoit.com',
  officialAddress: 'House #42, Road #11, Sector #4, Uttara, Dhaka-1230, Bangladesh',
  announcementText: '⚡ Flash Sale Live: Get 5% extra discount using coupon code SHOPNO5 at checkout!',
  showAnnouncement: true,
  maintenanceMode: false,
  autoLockMinutes: 15, // Security idle timeout
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export function ProductProvider({ children }) {
  // ─── PRODUCTS ────────────────────────────────────────────────────────────
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (err) {
      console.warn('Failed to load products from localStorage:', err)
    }
    return BD_PRODUCTS
  })

  // ─── CATEGORIES ──────────────────────────────────────────────────────────
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom categories with updated default categories
          const baseMap = new Map(BD_CATEGORIES.map((c) => [c.id, c]))
          parsed.forEach((c) => {
            if (!baseMap.has(c.id)) {
              baseMap.set(c.id, c)
            }
          })
          return Array.from(baseMap.values())
        }
      }
    } catch (err) {
      console.warn('Failed to load categories:', err)
    }
    return BD_CATEGORIES
  })

  // ─── ORDERS ──────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (err) {
      console.warn('Failed to load orders:', err)
    }
    return INITIAL_ORDERS
  })

  // ─── COUPONS ─────────────────────────────────────────────────────────────
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPONS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (err) {
      console.warn('Failed to load coupons:', err)
    }
    return INITIAL_COUPONS
  })

  // ─── INQUIRIES / CRM ─────────────────────────────────────────────────────
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(INQUIRIES_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (err) {
      console.warn('Failed to load inquiries:', err)
    }
    return INITIAL_INQUIRIES
  })

  // ─── STORE SETTINGS ──────────────────────────────────────────────────────
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') return { ...INITIAL_SETTINGS, ...parsed }
      }
    } catch (err) {
      console.warn('Failed to load store settings:', err)
    }
    return INITIAL_SETTINGS
  })

  // ─── SECURITY AUDIT LOGS ─────────────────────────────────────────────────
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(AUDIT_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch (err) {
      console.warn('Failed to load audit logs:', err)
    }
    return [
      {
        id: 'log-init',
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_INITIALIZE',
        detail: 'Security module initialized. SHA-256 hash validation enabled.',
        severity: 'info',
        fingerprint: getClientFingerprint(),
      },
    ]
  })

  // ─── ADMIN PIN HASH ──────────────────────────────────────────────────────
  const [pinHash, setPinHash] = useState(() => {
    return localStorage.getItem(ADMIN_PIN_HASH_KEY) || ''
  })

  // If no hash exists yet, initialize hash for DEFAULT_PIN
  useEffect(() => {
    if (!pinHash) {
      hashString(DEFAULT_PIN).then((h) => {
        setPinHash(h)
        localStorage.setItem(ADMIN_PIN_HASH_KEY, h)
      })
    }
  }, [pinHash])

  // ─── BRUTE FORCE LOCKOUT STATE ───────────────────────────────────────────
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const saved = localStorage.getItem(FAILED_ATTEMPTS_KEY)
    return saved ? parseInt(saved, 10) || 0 : 0
  })

  const [lockoutUntil, setLockoutUntil] = useState(() => {
    const saved = localStorage.getItem(LOCKOUT_STORAGE_KEY)
    return saved ? parseInt(saved, 10) || 0 : 0
  })

  // ─── PERSISTENCE SYNC ────────────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    } catch (err) {
      console.error('Failed to persist products:', err)
    }
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    } catch (err) {
      console.error('Failed to persist categories:', err)
    }
  }, [categories])

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch (err) {
      console.error('Failed to persist orders:', err)
    }
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons))
    } catch (err) {
      console.error('Failed to persist coupons:', err)
    }
  }, [coupons])

  useEffect(() => {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries))
    } catch (err) {
      console.error('Failed to persist inquiries:', err)
    }
  }, [inquiries])

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(storeSettings))
    } catch (err) {
      console.error('Failed to persist settings:', err)
    }
  }, [storeSettings])

  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLogs.slice(0, 100))) // keep latest 100
    } catch (err) {
      console.error('Failed to persist audit logs:', err)
    }
  }, [auditLogs])

  useEffect(() => {
    localStorage.setItem(FAILED_ATTEMPTS_KEY, failedAttempts.toString())
  }, [failedAttempts])

  useEffect(() => {
    localStorage.setItem(LOCKOUT_STORAGE_KEY, lockoutUntil.toString())
  }, [lockoutUntil])

  // ─── AUDIT LOGGING HELPER ────────────────────────────────────────────────
  const logAuditEvent = useCallback((action, detail, severity = 'info') => {
    const entry = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      action: sanitizeInput(action),
      detail: sanitizeInput(detail),
      severity,
      fingerprint: getClientFingerprint(),
    }
    setAuditLogs((prev) => [entry, ...prev.slice(0, 99)])
  }, [])

  // ─── SECURITY & AUTH HELPERS ─────────────────────────────────────────────
  const verifyAdminPin = useCallback(
    async (candidatePin) => {
      const now = Date.now()
      if (lockoutUntil > now) {
        const remainingSec = Math.ceil((lockoutUntil - now) / 1000)
        return {
          success: false,
          locked: true,
          remainingSec,
          message: `Portal temporarily locked due to excessive failed attempts. Try again in ${remainingSec}s.`,
        }
      }

      const candidateClean = candidatePin ? candidatePin.trim() : ''
      const candidateHashed = await hashString(candidateClean)
      const defaultHashed = await hashString(DEFAULT_PIN)

      const isMatch = candidateHashed === pinHash || (!pinHash && candidateHashed === defaultHashed)

      if (isMatch) {
        setFailedAttempts(0)
        localStorage.removeItem(FAILED_ATTEMPTS_KEY)
        localStorage.removeItem(LOCKOUT_STORAGE_KEY)
        logAuditEvent('ADMIN_LOGIN_SUCCESS', 'Administrator successfully unlocked dashboard.', 'success')
        return { success: true }
      } else {
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)

        let lockSeconds = 0
        if (newAttempts >= 8) {
          lockSeconds = 300 // 5 minutes lockout
        } else if (newAttempts >= 5) {
          lockSeconds = 60 // 1 minute lockout
        }

        if (lockSeconds > 0) {
          const lockTime = Date.now() + lockSeconds * 1000
          setLockoutUntil(lockTime)
          logAuditEvent(
            'BRUTE_FORCE_LOCKOUT',
            `Lockout triggered after ${newAttempts} failed passcode attempts. Locked for ${lockSeconds}s.`,
            'danger'
          )
          return {
            success: false,
            locked: true,
            remainingSec: lockSeconds,
            message: `Too many failed attempts. Login locked for ${lockSeconds} seconds.`,
          }
        } else {
          logAuditEvent(
            'ADMIN_LOGIN_FAILED',
            `Failed passcode attempt (#${newAttempts}).`,
            'warning'
          )
          return {
            success: false,
            locked: false,
            attemptsLeft: 5 - newAttempts,
            message: `Invalid passcode. ${5 - newAttempts} attempt(s) remaining before lockout.`,
          }
        }
      }
    },
    [lockoutUntil, pinHash, failedAttempts, logAuditEvent]
  )

  const updateAdminPin = useCallback(
    async (newPin) => {
      if (!newPin || newPin.trim().length < 4) {
        return { success: false, message: 'Passcode must be at least 4 characters long.' }
      }
      const hashed = await hashString(newPin.trim())
      setPinHash(hashed)
      localStorage.setItem(ADMIN_PIN_HASH_KEY, hashed)
      logAuditEvent('PASSCODE_UPDATED', 'Admin passcode was securely updated with SHA-256 hash.', 'warning')
      return { success: true, message: 'Admin passcode updated successfully.' }
    },
    [logAuditEvent]
  )

  const clearAuditLogs = useCallback(() => {
    setAuditLogs([
      {
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        action: 'LOGS_CLEARED',
        detail: 'Audit history was cleared by administrator.',
        severity: 'warning',
        fingerprint: getClientFingerprint(),
      },
    ])
  }, [])

  // ─── PRODUCT ACTIONS ─────────────────────────────────────────────────────
  const addProduct = useCallback(
    (productData) => {
      const sanitized = sanitizeObject(productData)
      const slug = (sanitized.name || 'product')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const newProduct = {
        ...sanitized,
        id: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
        price: Number(sanitized.price) || 0,
        originalPrice: Number(sanitized.originalPrice) || Number(sanitized.price) || 0,
        stock: Number(sanitized.stock) || 0,
        sold: Number(sanitized.sold) || 0,
        iconType: sanitized.iconType || 'custom',
        createdAt: new Date().toISOString(),
      }

      setProducts((prev) => [newProduct, ...prev])
      logAuditEvent('PRODUCT_CREATED', `Added new product: "${newProduct.name}" (৳${newProduct.price})`)
      return newProduct
    },
    [logAuditEvent]
  )

  const updateProduct = useCallback(
    (id, updatedFields) => {
      const sanitized = sanitizeObject(updatedFields)
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p
          return {
            ...p,
            ...sanitized,
            price: sanitized.price !== undefined ? Number(sanitized.price) : p.price,
            originalPrice:
              sanitized.originalPrice !== undefined
                ? Number(sanitized.originalPrice)
                : p.originalPrice,
            stock: sanitized.stock !== undefined ? Number(sanitized.stock) : p.stock,
            sold: sanitized.sold !== undefined ? Number(sanitized.sold) : p.sold,
          }
        })
      )
      logAuditEvent('PRODUCT_UPDATED', `Updated product details for ID: ${id}`)
    },
    [logAuditEvent]
  )

  const deleteProduct = useCallback(
    (id) => {
      const target = products.find((p) => p.id === id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      logAuditEvent('PRODUCT_DELETED', `Deleted product: "${target?.name || id}"`, 'warning')
    },
    [products, logAuditEvent]
  )

  const toggleStock = useCallback(
    (id) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p
          const nextStock = p.stock > 0 ? 0 : 25
          logAuditEvent(
            'STOCK_TOGGLED',
            `Changed stock for "${p.name}" to ${nextStock > 0 ? 'In Stock (25)' : 'Out of Stock'}`
          )
          return { ...p, stock: nextStock }
        })
      )
    },
    [logAuditEvent]
  )

  // ─── CATEGORY ACTIONS ────────────────────────────────────────────────────
  const addCategory = useCallback(
    (categoryData) => {
      const name = typeof categoryData === 'string' ? categoryData : categoryData?.name
      if (!name || !name.trim()) return

      const slug = (typeof categoryData === 'object' && categoryData.id)
        ? categoryData.id
        : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      const newCategory = {
        id: slug || `cat-${Date.now()}`,
        name: name.trim(),
        accent: (typeof categoryData === 'object' && categoryData.accent) || '#2563eb',
        iconType: (typeof categoryData === 'object' && categoryData.iconType) || 'auto',
      }

      setCategories((prev) => {
        if (prev.some((c) => c.id === newCategory.id)) return prev
        return [...prev, newCategory]
      })

      logAuditEvent('CATEGORY_ADDED', `Created new storefront category: "${newCategory.name}"`)
      return newCategory
    },
    [logAuditEvent]
  )

  const deleteCategory = useCallback(
    (id) => {
      setCategories((prev) => prev.filter((c) => c.id !== id))
      logAuditEvent('CATEGORY_DELETED', `Deleted category with ID: ${id}`, 'warning')
    },
    [logAuditEvent]
  )

  // ─── ORDER ACTIONS ───────────────────────────────────────────────────────
  const addOrder = useCallback(
    (orderData) => {
      const sanitized = sanitizeObject(orderData)
      const cleanOrder = {
        ...sanitized,
        orderId: sanitized.orderId || `SIT-${Math.floor(100000 + Math.random() * 900000)}`,
        status: sanitized.status || 'pending',
        date: sanitized.date || new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        createdAt: new Date().toISOString(),
      }
      setOrders((prev) => [cleanOrder, ...prev])

      // ─ Auto-deduct inventory stock for each ordered item ─────────────────
      const newMovements = []
      setProducts((prevProducts) => {
        const updated = prevProducts.map((product) => {
          const orderedItem = cleanOrder.items?.find(
            (item) => item.id === product.id || item.name === product.name
          )
          if (!orderedItem) return product

          const qty = Number(orderedItem.qty) || 1
          const newStock = Math.max(0, product.stock - qty)

          newMovements.push({
            id: `mv-${Date.now()}-${product.id}`,
            productId: product.id,
            productName: product.name,
            type: 'SALE',
            qty: -qty,
            stockBefore: product.stock,
            stockAfter: newStock,
            note: `Auto-deducted for Order ${cleanOrder.orderId}`,
            operator: 'System (Checkout)',
            timestamp: new Date().toISOString(),
          })

          return { ...product, stock: newStock, sold: (product.sold || 0) + qty }
        })

        // Persist new inventory movements to localStorage
        if (newMovements.length > 0) {
          try {
            const existing = JSON.parse(localStorage.getItem(INVENTORY_MOVEMENTS_KEY) || '[]')
            localStorage.setItem(
              INVENTORY_MOVEMENTS_KEY,
              JSON.stringify([...newMovements, ...existing])
            )
          } catch { /* ignore */ }
        }

        return updated
      })

      logAuditEvent(
        'ORDER_RECEIVED',
        `New order ${cleanOrder.orderId} placed by ${cleanOrder.customer?.name} (৳${cleanOrder.total}, ${cleanOrder.customer?.paymentMethod?.toUpperCase()}). Stock auto-deducted for ${cleanOrder.items?.length || 0} item(s).`
      )
      return cleanOrder
    },
    [logAuditEvent]
  )


  const updateOrderStatus = useCallback(
    (orderId, newStatus) => {
      setOrders((prev) =>
        prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
      )
      logAuditEvent('ORDER_STATUS_CHANGED', `Order ${orderId} status changed to "${newStatus.toUpperCase()}"`)
    },
    [logAuditEvent]
  )

  const deleteOrder = useCallback(
    (orderId) => {
      setOrders((prev) => prev.filter((ord) => ord.orderId !== orderId))
      logAuditEvent('ORDER_DELETED', `Order ${orderId} removed from records.`, 'warning')
    },
    [logAuditEvent]
  )

  const getOrderById = useCallback(
    (query) => {
      if (!query) return null
      const q = query.trim().toLowerCase()
      return (
        orders.find(
          (o) =>
            o.orderId.toLowerCase() === q ||
            (o.customer?.phone && o.customer.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')))
        ) || null
      )
    },
    [orders]
  )

  // ─── COUPON ACTIONS ──────────────────────────────────────────────────────
  const addCoupon = useCallback(
    (couponData) => {
      const sanitized = sanitizeObject(couponData)
      const newCoupon = {
        id: 'cpn-' + Date.now(),
        code: (sanitized.code || '').toUpperCase().trim(),
        discountPercent: Number(sanitized.discountPercent) || 5,
        active: true,
        usageCount: 0,
        description: sanitized.description || 'Promotional coupon code',
      }
      setCoupons((prev) => [newCoupon, ...prev])
      logAuditEvent('COUPON_CREATED', `Created discount coupon: "${newCoupon.code}" (${newCoupon.discountPercent}%)`)
      return newCoupon
    },
    [logAuditEvent]
  )

  const toggleCoupon = useCallback(
    (id) => {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
      )
      logAuditEvent('COUPON_TOGGLED', `Toggled active status for coupon ID: ${id}`)
    },
    [logAuditEvent]
  )

  const deleteCoupon = useCallback(
    (id) => {
      setCoupons((prev) => prev.filter((c) => c.id !== id))
      logAuditEvent('COUPON_DELETED', `Deleted coupon ID: ${id}`)
    },
    [logAuditEvent]
  )

  // ─── INQUIRIES / CRM ACTIONS ─────────────────────────────────────────────
  const addInquiry = useCallback(
    (inquiryData) => {
      const sanitized = sanitizeObject(inquiryData)
      const newInq = {
        id: 'inq-' + Date.now(),
        ...sanitized,
        status: 'new',
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
      }
      setInquiries((prev) => [newInq, ...prev])
      logAuditEvent('INQUIRY_RECEIVED', `Customer lead received from ${newInq.name} (${newInq.phone})`)
      return newInq
    },
    [logAuditEvent]
  )

  const updateInquiryStatus = useCallback(
    (id, status) => {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      )
      logAuditEvent('INQUIRY_STATUS_UPDATED', `Inquiry ${id} marked as "${status.toUpperCase()}"`)
    },
    [logAuditEvent]
  )

  const deleteInquiry = useCallback(
    (id) => {
      setInquiries((prev) => prev.filter((inq) => inq.id !== id))
    },
    []
  )

  // ─── STORE SETTINGS ACTIONS ──────────────────────────────────────────────
  const updateStoreSettings = useCallback(
    (newSettings) => {
      const sanitized = sanitizeObject(newSettings)
      setStoreSettings((prev) => ({ ...prev, ...sanitized }))
      logAuditEvent('SETTINGS_UPDATED', 'Store operational settings updated.')
    },
    [logAuditEvent]
  )

  // ─── BACKUP & FACTORY RESET ──────────────────────────────────────────────
  const exportSystemBackup = useCallback(() => {
    const backupData = {
      format: 'SHOPNO_IT_ENTERPRISE_BACKUP',
      version: '5.0',
      exportedAt: new Date().toISOString(),
      brand: storeSettings.storeName,
      products,
      categories,
      orders,
      coupons,
      inquiries,
      storeSettings,
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shopno-it-full-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    logAuditEvent('BACKUP_EXPORTED', 'Full system JSON backup exported.')
  }, [storeSettings, products, categories, orders, coupons, inquiries, logAuditEvent])

  const importSystemBackup = useCallback(
    (jsonString) => {
      try {
        const data = JSON.parse(jsonString)
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid JSON format.')
        }

        let importedCount = 0
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products)
          importedCount += data.products.length
        }
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories)
        }
        if (Array.isArray(data.orders)) {
          setOrders(data.orders)
        }
        if (Array.isArray(data.coupons)) {
          setCoupons(data.coupons)
        }
        if (Array.isArray(data.inquiries)) {
          setInquiries(data.inquiries)
        }
        if (data.storeSettings && typeof data.storeSettings === 'object') {
          setStoreSettings((prev) => ({ ...prev, ...data.storeSettings }))
        }

        logAuditEvent('BACKUP_RESTORED', `System restored from backup. Loaded ${importedCount} products.`, 'warning')
        return { success: true, count: importedCount }
      } catch (err) {
        return { success: false, error: err.message }
      }
    },
    [logAuditEvent]
  )

  const resetToDefaults = useCallback(() => {
    setProducts(BD_PRODUCTS)
    setCategories(BD_CATEGORIES)
    setOrders(INITIAL_ORDERS)
    setCoupons(INITIAL_COUPONS)
    setInquiries(INITIAL_INQUIRIES)
    setStoreSettings(INITIAL_SETTINGS)
    localStorage.removeItem(PRODUCTS_STORAGE_KEY)
    localStorage.removeItem(CATEGORIES_STORAGE_KEY)
    localStorage.removeItem(ORDERS_STORAGE_KEY)
    localStorage.removeItem(COUPONS_STORAGE_KEY)
    localStorage.removeItem(INQUIRIES_STORAGE_KEY)
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
    logAuditEvent('FACTORY_RESET', 'All store modules reset to initial factory data.', 'danger')
  }, [logAuditEvent])

  // Backward compatibility alias for legacy PIN calls
  const updatePin = updateAdminPin

  return (
    <ProductContext.Provider
      value={{
        // Products
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        addCategory,
        deleteCategory,

        // Orders
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderById,

        // Coupons
        coupons,
        addCoupon,
        toggleCoupon,
        deleteCoupon,

        // Inquiries / CRM
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,

        // Store Settings
        storeSettings,
        updateStoreSettings,

        // Security & Audit
        auditLogs,
        logAuditEvent,
        clearAuditLogs,
        verifyAdminPin,
        updateAdminPin,
        updatePin,
        adminPin: DEFAULT_PIN, // fallback reference
        lockoutUntil,

        // Backups & Reset
        exportSystemBackup,
        importSystemBackup,
        resetToDefaults,
        exportCatalog: exportSystemBackup,
        importCatalog: importSystemBackup,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider

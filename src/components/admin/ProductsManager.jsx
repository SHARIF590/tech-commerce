import { useState, useMemo, useRef } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import ProductIcon from '../ProductIcon'
import { resolveAssetUrl } from '../../utils/assets'

// Compress and convert uploaded image into an ultra-fast base64 data URL
const processUploadedImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    // For SVGs, preserve pure vector format
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
      return
    }

    // For PNG/JPG/WebP/GIF, scale down to max 512px to prevent localStorage overflow
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 512
        let width = img.width
        let height = img.height

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const isTransparentPng = file.type === 'image/png'
        const outputFormat = isTransparentPng ? 'image/png' : 'image/jpeg'
        const compressedData = canvas.toDataURL(outputFormat, 0.88)
        resolve(compressedData)
      }
      img.onerror = () => resolve(e.target?.result)
      img.src = e.target?.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const AVAILABLE_ICONS = [
  { type: 'canva', label: 'Canva Pro' },
  { type: 'gemini', label: 'Google Gemini' },
  { type: 'chatgpt', label: 'ChatGPT Plus' },
  { type: 'windows', label: 'Windows 11/10' },
  { type: 'office', label: 'Office 365' },
  { type: 'capcut', label: 'CapCut Pro' },
  { type: 'adobe', label: 'Adobe Cloud' },
  { type: 'nordvpn', label: 'NordVPN' },
  { type: 'duolingo', label: 'Duolingo Plus' },
  { type: 'gmail', label: 'Google Workspace' },
  { type: 'amazon', label: 'Prime Video' },
  { type: 'custom', label: 'Generic License' },
]

export default function ProductsManager({
  products = [],
  categories = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStock,
  isModalOpen,
  setIsModalOpen,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all') // 'all' | 'in' | 'out'

  const [editingProductId, setEditingProductId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'AI Services',
    categoryId: 'ai-services',
    price: '',
    originalPrice: '',
    buyingPrice: '',
    stock: 25,
    sold: 10,
    iconType: 'canva',
    image: '',
    iconMode: 'preset',
    badge: 'HOT',
    desc: '',
    delivery: 'Instant Email & WhatsApp (15–30 Mins)',
    warranty: '1 Year Replacement Warranty',
    featuresText: '100% Genuine Private Access\nInstant Activation\nDedicated Support Desk',
  })

  // Image Upload and URL State
  const fileInputRef = useRef(null)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')

  // Filtered products in table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false
      if (stockFilter === 'in' && Number(p.stock) <= 0) return false
      if (stockFilter === 'out' && Number(p.stock) > 0) return false
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim()
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [products, categoryFilter, stockFilter, searchTerm])

  const handleOpenAdd = () => {
    setEditingProductId(null)
    setImageUrlInput('')
    setImageUploadError('')
    setFormData({
      name: '',
      category: categories[0]?.name || 'AI Services',
      categoryId: categories[0]?.id || 'ai-services',
      price: '',
      originalPrice: '',
      buyingPrice: '',
      stock: 30,
      sold: 5,
      iconType: 'canva',
      image: '',
      iconMode: 'preset',
      badge: 'POPULAR',
      desc: 'Genuine software subscription voucher with instant verification.',
      delivery: 'Instant Email & WhatsApp (15–30 Mins)',
      warranty: '1 Year Replacement Warranty',
      featuresText: '100% Genuine Access\nDirect Vendor Activation\nReplacement Warranty',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (prod) => {
    setEditingProductId(prod.id)
    const hasCustomImg = Boolean(
      prod.image ||
      (prod.iconType && (
        prod.iconType.startsWith('data:') ||
        prod.iconType.startsWith('http://') ||
        prod.iconType.startsWith('https://') ||
        prod.iconType.startsWith('blob:') ||
        prod.iconType.startsWith('/')
      ))
    )
    const currentImg = prod.image || (hasCustomImg ? prod.iconType : '')
    setImageUrlInput(currentImg.startsWith('http') ? currentImg : '')
    setImageUploadError('')
    setFormData({
      name: prod.name,
      category: prod.category,
      categoryId: prod.categoryId,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      buyingPrice: prod.buyingPrice || '',
      stock: prod.stock || 0,
      sold: prod.sold || 0,
      iconType: prod.iconType || (currentImg ? 'custom' : 'canva'),
      image: currentImg,
      iconMode: hasCustomImg ? 'upload' : 'preset',
      badge: prod.badge || '',
      desc: prod.desc || '',
      delivery: prod.delivery || 'Instant Email & WhatsApp',
      warranty: prod.warranty || 'Replacement Warranty',
      featuresText: Array.isArray(prod.features) ? prod.features.join('\n') : '',
    })
    setIsModalOpen(true)
  }

  const handleProcessImageFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).')
      return
    }

    setIsUploadingImage(true)
    setImageUploadError('')

    try {
      const dataUrl = await processUploadedImage(file)
      if (dataUrl) {
        setFormData((prev) => ({
          ...prev,
          image: dataUrl,
          iconType: dataUrl,
          iconMode: 'upload',
        }))
        setImageUrlInput('')
      }
    } catch (err) {
      console.error('Image upload failed:', err)
      setImageUploadError('Could not process image file. Please try another.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleApplyImageUrl = () => {
    if (!imageUrlInput.trim()) return
    const url = imageUrlInput.trim()
    setFormData((prev) => ({
      ...prev,
      image: url,
      iconType: url,
      iconMode: 'upload',
    }))
    setImageUploadError('')
  }

  const handleRemoveCustomImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: '',
      iconType: 'canva',
      iconMode: 'preset',
    }))
    setImageUrlInput('')
    setImageUploadError('')
  }

  const handleSaveProduct = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.price) {
      alert('Please provide product name and price.')
      return
    }

    const featuresArray = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    const foundCat = categories.find(
      (c) => c.name.toLowerCase() === formData.category.toLowerCase()
    )
    const categoryId =
      foundCat?.id ||
      formData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    const customImage = formData.iconMode === 'upload' ? formData.image?.trim() || '' : ''
    const effectiveIconType = customImage || formData.iconType || 'custom'

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      categoryId,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || Number(formData.price),
      buyingPrice: Number(formData.buyingPrice) || 0,
      stock: Number(formData.stock) || 0,
      sold: Number(formData.sold) || 0,
      image: customImage,
      iconType: effectiveIconType,
      badge: formData.badge.trim(),
      desc: formData.desc.trim(),
      features: featuresArray,
      delivery: formData.delivery.trim(),
      warranty: formData.warranty.trim(),
    }

    if (editingProductId) {
      onUpdateProduct(editingProductId, payload)
    } else {
      onAddProduct(payload)
    }

    setIsModalOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search, Filters, and New Button */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 18,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap', minWidth: 280 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
            <input
              type="text"
              placeholder="Search products by title or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              background: '#fff',
              outline: 'none',
              fontWeight: 600,
            }}
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              background: '#fff',
              outline: 'none',
              fontWeight: 600,
            }}
          >
            <option value="all">All Stock Statuses</option>
            <option value="in">In Stock Only</option>
            <option value="out">Out of Stock Only</option>
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
          }}
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Catalog Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 20,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Product &amp; Brand</th>
                <th style={{ padding: '12px 14px' }}>Department</th>
                <th style={{ padding: '12px 14px' }}>Price &amp; Margin</th>
                <th style={{ padding: '12px 14px' }}>Inventory Stock</th>
                <th style={{ padding: '12px 14px' }}>Sales Count</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                    No products match your filter. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isInStock = Number(p.stock) > 0
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              overflow: 'hidden',
                            }}
                          >
                            <ProductIcon type={p.iconType} image={p.image} fill size={22} />
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: '#0f172a', fontSize: 13.5 }}>
                              {p.name}
                            </strong>
                            {p.badge && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  background: '#eff6ff',
                                  color: '#2563eb',
                                  border: '1px solid #bfdbfe',
                                  fontSize: 10,
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  fontWeight: 700,
                                  marginTop: 2,
                                }}
                              >
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', color: '#475569' }}>
                        {p.category}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: '#1d4ed8', display: 'block', fontSize: 14 }}>৳ {p.price.toLocaleString()}</strong>
                        {p.originalPrice > p.price && (
                          <del style={{ fontSize: 11, color: '#94a3b8' }}>
                            ৳ {p.originalPrice.toLocaleString()}
                          </del>
                        )}
                        {p.buyingPrice > 0 && (() => {
                          const profit    = p.price - p.buyingPrice
                          const marginPct = ((profit / p.price) * 100).toFixed(0)
                          const isLoss    = profit < 0
                          return (
                            <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontSize: 10, color: '#64748b' }}>
                                Cost: <strong style={{ color: '#b91c1c' }}>৳{p.buyingPrice}</strong>
                              </span>
                              <span style={{
                                display: 'inline-block', fontSize: 10, fontWeight: 800,
                                background: isLoss ? '#fee2e2' : '#dcfce7',
                                color: isLoss ? '#b91c1c' : '#16a34a',
                                borderRadius: 4, padding: '1px 5px',
                              }}>
                                {isLoss ? '⚠ LOSS' : `+৳${profit} · ${marginPct}% margin`}
                              </span>
                            </div>
                          )
                        })()}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => onToggleStock(p.id)}
                          title="Click to toggle stock status"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 10px',
                            borderRadius: 99,
                            fontSize: 11.5,
                            fontWeight: 800,
                            cursor: 'pointer',
                            border: isInStock ? '1px solid #bbf7d0' : '1px solid #fecaca',
                            background: isInStock ? '#ecfdf5' : '#fef2f2',
                            color: isInStock ? '#15803d' : '#b91c1c',
                          }}
                        >
                          ● {isInStock ? `${p.stock} In Stock` : 'Out of Stock'}
                        </button>
                      </td>

                      <td style={{ padding: '12px 14px', color: '#64748b' }}>
                        {p.sold || 0} orders
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: '#2563eb',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Edit2 size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                onDeleteProduct(p.id)
                              }
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 6,
                              border: '1px solid #fecaca',
                              background: '#fff5f5',
                              color: '#ef4444',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                            title="Delete product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 780,
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              padding: 32,
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  Catalog Editor
                </span>
                <h2 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                  {editingProductId ? 'Edit Product Details' : 'Add New Product to Storefront'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Product Title */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canva Pro (1 Year Private Access)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none' }}
                />
              </div>

              {/* Category & Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff', outline: 'none' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Custom Software">Custom Software / Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Promotional Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HOT, 40% OFF, BESTSELLER"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Pricing, Cost & Stock */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
                  💰 Pricing & Inventory
                </label>

                {/* Row 1: Buying Price + Selling Price + Original Price */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#dc2626', marginBottom: 5 }}>
                      🏷️ Buying / Cost Price (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 80"
                      value={formData.buyingPrice}
                      onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: '2px solid #fca5a5', fontSize: 14, fontWeight: 700,
                        outline: 'none', background: '#fff', boxSizing: 'border-box',
                        color: '#b91c1c',
                      }}
                    />
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                      What you pay to acquire
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 5 }}>
                      Selling Price (৳) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="499"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 700,
                        outline: 'none', boxSizing: 'border-box', color: '#1d4ed8',
                      }}
                    />
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                      Customer-facing price
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 5 }}>
                      Original / MRP Price (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="899"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: '1px solid #cbd5e1', fontSize: 14, outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                      Shown as strikethrough
                    </div>
                  </div>
                </div>

                {/* Row 2: Stock + Sold */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 5 }}>
                      Stock Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="25"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: '1px solid #cbd5e1', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 5 }}>
                      Orders Sold
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="10"
                      value={formData.sold}
                      onChange={(e) => setFormData({ ...formData, sold: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: '1px solid #cbd5e1', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Live Profit / Revenue Preview */}
                {(() => {
                  const sp  = Number(formData.price) || 0
                  const bp  = Number(formData.buyingPrice) || 0
                  const qty = Number(formData.sold) || 0
                  const profitPerUnit = sp - bp
                  const totalProfit   = profitPerUnit * qty
                  const totalRevenue  = sp * qty
                  const totalCost     = bp * qty
                  const marginPct     = sp > 0 ? ((profitPerUnit / sp) * 100).toFixed(1) : 0
                  const hasBuying     = bp > 0
                  const isLoss        = profitPerUnit < 0

                  return (
                    <div style={{
                      background: isLoss ? '#fff5f5' : '#f0fdf4',
                      border: `1.5px solid ${isLoss ? '#fca5a5' : '#86efac'}`,
                      borderRadius: 12, padding: '14px 16px',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: isLoss ? '#b91c1c' : '#15803d', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {hasBuying ? (isLoss ? '⚠️ Selling at a Loss!' : '📊 Profit & Revenue Preview') : '📊 Revenue Preview (no cost set)'}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                        {[
                          { label: 'Revenue / Sale', value: `৳ ${sp.toLocaleString()}`, color: '#1d4ed8', show: sp > 0 },
                          { label: 'Cost / Unit', value: `৳ ${bp.toLocaleString()}`, color: '#b91c1c', show: hasBuying },
                          { label: 'Profit / Unit', value: `৳ ${profitPerUnit.toLocaleString()}`, color: isLoss ? '#b91c1c' : '#16a34a', show: hasBuying },
                          { label: 'Margin %', value: `${marginPct}%`, color: isLoss ? '#b91c1c' : '#7c3aed', show: hasBuying },
                          { label: `Total Revenue (${qty} sold)`, value: `৳ ${totalRevenue.toLocaleString()}`, color: '#1d4ed8', show: qty > 0 },
                          { label: 'Total Cost', value: `৳ ${totalCost.toLocaleString()}`, color: '#dc2626', show: hasBuying && qty > 0 },
                          { label: 'Total Profit', value: `৳ ${totalProfit.toLocaleString()}`, color: isLoss ? '#b91c1c' : '#16a34a', show: hasBuying && qty > 0 },
                        ].filter(c => c.show).map((c, i) => (
                          <div key={i} style={{
                            background: '#fff', borderRadius: 8,
                            padding: '8px 10px', border: '1px solid #e2e8f0',
                          }}>
                            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 2 }}>{c.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 900, color: c.color }}>{c.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Product Visuals: Preset vs Custom Upload */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                  Product Brand Icon / Image
                </label>

                {/* Mode Selector */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, iconMode: 'preset' })}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: formData.iconMode === 'preset' ? '#2563eb' : '#e2e8f0',
                      color: formData.iconMode === 'preset' ? '#fff' : '#475569',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Preset Brand Logos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, iconMode: 'upload' })}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: formData.iconMode === 'upload' ? '#2563eb' : '#e2e8f0',
                      color: formData.iconMode === 'upload' ? '#fff' : '#475569',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Upload Custom Image or Web URL
                  </button>
                </div>

                {formData.iconMode === 'preset' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                    {AVAILABLE_ICONS.map((ic) => (
                      <button
                        type="button"
                        key={ic.type}
                        onClick={() => setFormData({ ...formData, iconType: ic.type, image: '' })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '6px 10px',
                          borderRadius: 8,
                          border: formData.iconType === ic.type ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: formData.iconType === ic.type ? '#eff6ff' : '#fff',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ width: 22, height: 22 }}>
                          <ProductIcon type={ic.type} fill size={18} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{ic.label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleProcessImageFile(file)
                        }}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 16px',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          background: '#fff',
                          color: '#1e293b',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={14} />
                        <span>{isUploadingImage ? 'Compressing Image...' : 'Upload Image File'}</span>
                      </button>

                      <span style={{ fontSize: 12, color: '#94a3b8' }}>or paste direct Image URL:</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyImageUrl}
                        style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Apply URL
                      </button>
                    </div>

                    {formData.image && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                        <img
                          src={resolveAssetUrl(formData.image)}
                          alt="preview"
                          style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}
                        />
                        <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Custom image active</span>
                        <button
                          type="button"
                          onClick={handleRemoveCustomImage}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {imageUploadError && (
                      <div style={{ fontSize: 12, color: '#ef4444' }}>{imageUploadError}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery & Warranty */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Delivery Timeframe Note
                  </label>
                  <input
                    type="text"
                    value={formData.delivery}
                    onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Warranty &amp; Guarantee Note
                  </label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13 }}
                  />
                </div>
              </div>

              {/* Bullet Features */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Key Features (One feature per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="100% Genuine Private Access&#10;Instant Activation&#10;Dedicated Support"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, resize: 'vertical' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#475569',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {editingProductId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

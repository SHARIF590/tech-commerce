import { useState } from 'react'
import { Plus, Trash2, Tag, Sparkles } from 'lucide-react'
import CategoryIcon from '../CategoryIcon'

const COLOR_PRESETS = [
  { label: 'Blue', value: '#2563eb' },
  { label: 'Cyan', value: '#0891b2' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Sky', value: '#38bdf8' },
]

const ICON_OPTIONS = [
  { id: 'ai', label: 'AI & Machine Learning' },
  { id: 'creative', label: 'Creative, Video & Design' },
  { id: 'education', label: 'Education & Productivity' },
  { id: 'microsoft', label: 'Microsoft & Office' },
  { id: 'windows', label: 'Windows & Operating Systems' },
  { id: 'cloud', label: 'Cloud Storage & Workspace' },
  { id: 'marketing', label: 'Meta & Ad Verification' },
  { id: 'security', label: 'Privacy, Security & Antivirus' },
  { id: 'subscription', label: 'Streaming & Subscriptions' },
  { id: 'code', label: 'Developer & Code Tools' },
  { id: 'gaming', label: 'Gaming & Keys' },
  { id: 'general', label: 'General / App Grid' },
]

export default function CategoriesManager({
  categories = [],
  products = [],
  onAddCategory,
  onDeleteCategory,
}) {
  const [newCatName, setNewCatName] = useState('')
  const [accent, setAccent] = useState('#2563eb')
  const [iconType, setIconType] = useState('general')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    onAddCategory({
      name: newCatName.trim(),
      accent,
      iconType,
    })
    setNewCatName('')
  }

  // Count products in each category
  const countsMap = {}
  products.forEach((p) => {
    countsMap[p.categoryId] = (countsMap[p.categoryId] || 0) + 1
  })

  const previewCat = {
    id: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: newCatName || 'Category Preview',
    accent,
    iconType,
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
      {/* Categories List */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 24,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Storefront Categories ({categories.length})
            </h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
              Taxonomies used for storefront navigation, filtering tabs, and icon cards
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categories.map((cat) => {
            const count = countsMap[cat.id] || 0
            return (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 12,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: `color-mix(in srgb, ${cat.accent || '#2563eb'} 12%, white)`,
                      color: cat.accent || '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${cat.accent || '#2563eb'}30`,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon category={cat} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 14, color: '#0f172a' }}>{cat.name}</strong>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: cat.accent || '#2563eb',
                          display: 'inline-block',
                        }}
                        title={`Accent: ${cat.accent || '#2563eb'}`}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      Slug: <code>{cat.id}</code> • Icon: <span style={{ color: '#0f172a', fontWeight: 600 }}>{cat.iconType || 'auto'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      background: count > 0 ? '#dbeafe' : '#f1f5f9',
                      color: count > 0 ? '#1e40af' : '#64748b',
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 99,
                    }}
                  >
                    {count} products
                  </span>

                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${cat.name}"? Products assigned to it will remain in catalog.`)) {
                        onDeleteCategory(cat.id)
                      }
                    }}
                    style={{
                      background: '#fff5f5',
                      border: '1px solid #fecaca',
                      color: '#ef4444',
                      padding: '6px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                    title="Delete category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Category Form & Live Preview */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 24,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          height: 'fit-content',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Tag size={16} color="#2563eb" />
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            + Add New Category
          </h3>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
          Categories are automatically equipped with matching vector icons and interactive filters.
        </p>

        {/* Live Preview Card */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 14,
            padding: '14px',
            textAlign: 'center',
            marginBottom: 18,
          }}
        >
          <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
            Live Storefront Card Preview
          </span>
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '12px 18px',
              borderRadius: 12,
              background: '#fff',
              border: `1.5px solid ${accent}`,
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `color-mix(in srgb, ${accent} 12%, white)`,
                color: accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 24, height: 24 }}>
                <CategoryIcon category={previewCat} />
              </div>
            </div>
            <strong style={{ fontSize: 12, color: '#0f172a', maxWidth: 140 }}>
              {newCatName || 'Category Name'}
            </strong>
          </div>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Developer &amp; Code Tools"
              value={newCatName}
              onChange={(e) => {
                const val = e.target.value
                setNewCatName(val)
                // Auto-suggest icon based on keywords if user hasn't manually picked
                const lower = val.toLowerCase()
                if (lower.includes('code') || lower.includes('dev') || lower.includes('tool')) setIconType('code')
                else if (lower.includes('game') || lower.includes('steam')) setIconType('gaming')
                else if (lower.includes('stream') || lower.includes('music') || lower.includes('sub')) setIconType('subscription')
                else if (lower.includes('cloud') || lower.includes('drive')) setIconType('cloud')
                else if (lower.includes('ai') || lower.includes('gpt')) setIconType('ai')
                else if (lower.includes('video') || lower.includes('design')) setIconType('creative')
                else if (lower.includes('security') || lower.includes('vpn')) setIconType('security')
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Choose Matching Vector Icon
            </label>
            <select
              value={iconType}
              onChange={(e) => setIconType(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 12.5,
                background: '#fff',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Theme Accent Color
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setAccent(c.value)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: c.value,
                    border: accent === c.value ? '2.5px solid #0f172a' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  }}
                  title={c.label}
                />
              ))}
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                style={{
                  width: 30,
                  height: 28,
                  padding: 0,
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: 'transparent',
                }}
                title="Custom color picker"
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '11px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            <Plus size={16} />
            <span>Create Category</span>
          </button>
        </form>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0', fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>
          <Sparkles size={13} style={{ display: 'inline', color: '#f59e0b', verticalAlign: 'text-bottom', marginRight: 4 }} />
          <strong>Smart Auto-Icon:</strong> Names containing keywords like "Code", "Cloud", "Video", or "VPN" will automatically select the right icon for you.
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  Download,
  AlertOctagon,
  Save,
  Sliders,
} from 'lucide-react'

export default function BackupSettingsManager({
  storeSettings = {},
  onUpdateStoreSettings,
  onExportBackup,
  onImportBackup,
  onResetToDefaults,
}) {
  const [formData, setFormData] = useState({
    storeName: storeSettings.storeName || 'Shopno IT Limited',
    tagline: storeSettings.tagline || '',
    supportPhone: storeSettings.supportPhone || '+88 01618-979790',
    supportWhatsApp: storeSettings.supportWhatsApp || '+88 01618-979790',
    supportEmail: storeSettings.supportEmail || 'support@shopnoit.com',
    officialAddress: storeSettings.officialAddress || '',
    announcementText: storeSettings.announcementText || '',
    showAnnouncement: storeSettings.showAnnouncement ?? true,
  })

  const [importStatus, setImportStatus] = useState('')
  const [saveStatus, setSaveStatus] = useState('')

  const handleSaveSettings = (e) => {
    e.preventDefault()
    onUpdateStoreSettings(formData)
    setSaveStatus('Store settings successfully updated!')
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const result = onImportBackup(evt.target?.result)
      if (result.success) {
        setImportStatus(`Success! Restored system snapshot with ${result.count} products.`)
      } else {
        setImportStatus(`Import failed: ${result.error}`)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
      {/* Column 1: Store Operational Settings */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 24,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Sliders size={20} color="#2563eb" />
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Storefront Identity &amp; Contact Desk
          </h2>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>
          Configure public customer contact numbers, helpline WhatsApp, and broadcast banners.
        </p>

        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Brand / Store Name
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Helpline WhatsApp
              </label>
              <input
                type="text"
                value={formData.supportWhatsApp}
                onChange={(e) => setFormData({ ...formData, supportWhatsApp: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Hotline Phone
              </label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Support Email
            </label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
            />
          </div>

          {/* Announcement Broadcast Banner */}
          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>
                Top Header Notice Banner
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.showAnnouncement}
                  onChange={(e) => setFormData({ ...formData, showAnnouncement: e.target.checked })}
                />
                <span style={{ fontWeight: 600 }}>Enable Banner</span>
              </label>
            </div>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              placeholder="e.g. ⚡ Flash Sale: Get 5% off with code SHOPNO5!"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5 }}
            />
          </div>

          {saveStatus && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: '#ecfdf5', color: '#065f46', fontSize: 12, fontWeight: 700, border: '1px solid #a7f3d0' }}>
              ✓ {saveStatus}
            </div>
          )}

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
              marginTop: 6,
            }}
          >
            <Save size={16} />
            <span>Save Store Settings</span>
          </button>
        </form>
      </div>

      {/* Column 2: Backups & Restores */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Export JSON Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            1. Download Full System Snapshot
          </h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
            Generates a unified JSON file backup of all products, orders, categories, coupons, and configurations.
          </p>
          <button
            onClick={onExportBackup}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              background: '#0f172a',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Restore Backup Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            2. Restore from Backup File
          </h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
            Upload a previously saved Shopno IT `.json` file to restore all store state.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ fontSize: 12 }}
          />
          {importStatus && (
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: 700,
                color: importStatus.startsWith('Success') ? '#16a34a' : '#ef4444',
              }}
            >
              {importStatus}
            </div>
          )}
        </div>

        {/* Factory Reset Card */}
        <div
          style={{
            background: '#fff5f5',
            borderRadius: 16,
            border: '1px solid #fecaca',
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <AlertOctagon size={18} color="#dc2626" />
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#b91c1c', margin: 0 }}>
              Factory Reset Catalog
            </h3>
          </div>
          <p style={{ fontSize: 12, color: '#7f1d1d', margin: '0 0 16px', lineHeight: 1.5 }}>
            Resets all software products, categories, orders, and inquiries to factory defaults.
          </p>
          <button
            onClick={() => {
              if (confirm('CRITICAL: Reset all store data back to original factory presets? This cannot be undone.')) {
                onResetToDefaults()
                alert('Store reset to factory default data!')
              }
            }}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '9px 18px',
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Reset to Factory Presets
          </button>
        </div>
      </div>
    </div>
  )
}

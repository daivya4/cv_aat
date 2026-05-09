import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, CheckCircle, Download, RefreshCcw, Scan } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [scannedUrl, setScannedUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setScannedUrl(null)
      setError(null)
    }
  }

  const handleScan = async () => {
    if (!image) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', image)

    try {
      const response = await fetch('http://localhost:8000/scan', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Scan failed. Please try a clearer image.')
      }

      const blob = await response.blob()
      setScannedUrl(URL.createObjectURL(blob))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreviewUrl(null)
    setScannedUrl(null)
    setError(null)
  }

  const downloadImage = () => {
    if (!scannedUrl) return
    const link = document.createElement('a')
    link.href = scannedUrl
    link.download = `scanned_${image.name}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="app-container">
      <header className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>DocScanner Pro</h1>
          <p className="description">Transform your photos into professional digital documents instantly</p>
        </motion.div>
      </header>

      <main className="main-content">
        {!previewUrl ? (
          <motion.div 
            className="upload-section"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -5 }}
          >
            <div 
              className="drop-zone"
              onClick={() => fileInputRef.current.click()}
            >
              <Upload size={48} className="text-primary" style={{ color: 'var(--primary)' }} />
              <h3>Upload Document Photo</h3>
              <p>Drag and drop or click to browse</p>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Supports JPG, PNG, WEBP</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden-input"
              accept="image/*"
            />
          </motion.div>
        ) : (
          <div className="results-grid">
            <motion.div 
              className="image-card"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Original</h3>
                <ImageIcon size={20} style={{ color: 'var(--text-muted)' }} />
              </div>
              <img src={previewUrl} alt="Original" className="image-preview" />
              <button className="btn-secondary" onClick={handleReset} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <RefreshCcw size={16} style={{ marginRight: '8px' }} /> Change Image
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              {!scannedUrl ? (
                <motion.div 
                  key="scan-placeholder"
                  className="image-card"
                  style={{ justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' }}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {isLoading ? (
                    <div className="scan-line"></div>
                  ) : null}
                  <Scan size={64} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
                  <p className="text-muted">Ready to enhance</p>
                  <button 
                    className="btn-primary" 
                    onClick={handleScan}
                    disabled={isLoading}
                    style={{ marginTop: '1rem' }}
                  >
                    {isLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="loading-spinner"></div> Processing...
                      </div>
                    ) : 'Start Scan'}
                  </button>
                  {error && <p className="error-message" style={{ marginTop: '1rem' }}>{error}</p>}
                </motion.div>
              ) : (
                <motion.div 
                  key="scanned-result"
                  className="image-card"
                  initial={{ x: 20, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                      <h3>Scanned Result</h3>
                    </div>
                    <button onClick={downloadImage} style={{ background: 'none', border: 'none', padding: '4px' }}>
                      <Download size={20} style={{ color: 'var(--primary)' }} />
                    </button>
                  </div>
                  <img src={scannedUrl} alt="Scanned" className="image-preview" />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={downloadImage}>
                      Download PNG
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>Built with Computer Vision & Advanced Document Processing</p>
      </footer>
    </div>
  )
}

export default App

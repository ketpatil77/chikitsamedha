import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Loader2, Pill, ArrowRight } from 'lucide-react'
import { API_BASE } from '../lib/theme'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { t } from '../i18n'
import { useLang } from '../context/LangContext'

export default function Scan() {
  const { lang } = useLang()
  const nav = useNavigate()
  const { push } = useToast()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setResults([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1
  })

  const analyze = async () => {
    if (!file) return
    setScanning(true)

    // Simulate scan
    setTimeout(() => {
      setScanning(false)
      const mockResult = ['Combiflam', 'Dolo-650', 'Amoxicillin'] // Mock OCR
      setResults(mockResult)
      push({ kind: 'success', text: `Found ${mockResult.length} medicines` })
    }, 2000)
  }

  const confirm = () => {
    const existing = JSON.parse(localStorage.getItem('cm_pending_meds') || '[]')
    const combined = Array.from(new Set([...existing, ...results]))
    localStorage.setItem('cm_pending_meds', JSON.stringify(combined))
    nav('/check')
  }

  return (
    <div className="layout-container py-12 max-w-2xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-display text-white mb-2">{t('scanWrapper', lang)}</h1>
        <p className="text-[var(--text-muted)]">Upload an image of medicine packaging to auto-detect names.</p>
      </header>

      <div className="card-panel p-8 mb-8 border-dashed border-2 hover:border-[var(--accent-primary)] transition-colors cursor-pointer" {...getRootProps()}>
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center group">
            <img src={preview} alt="Upload" className="max-h-full object-contain opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="btn btn-ghost text-white border-white/20">Change Image</span>
            </div>
            {scanning && (
              <div className="absolute inset-0 bg-black/60 flex items-col justify-center items-center backdrop-blur-sm z-10">
                <Loader2 size={32} className="animate-spin text-[var(--accent-primary)] mb-2" />
                <span className="font-mono text-xs uppercase tracking-widest text-white">Scanning...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)] group-hover:text-white transition-colors">
            <div className="w-16 h-16 rounded-full bg-[var(--border-subtle)] flex items-center justify-center mb-4 group-hover:bg-[var(--accent-primary)] group-hover:text-black transition-colors">
              <Camera size={28} />
            </div>
            <p className="font-medium text-lg">Drag & Drop or Click to Upload</p>
            <p className="text-sm text-[var(--text-dim)] mt-2">Supports JPG, PNG</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-panel"
          >
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border-subtle)] pb-2">
              <h3 className="font-bold text-white uppercase text-sm tracking-wider">Detected: {results.length}</h3>
            </div>
            <div className="space-y-2 mb-6">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                  <Pill size={16} className="text-[var(--accent-primary)]" />
                  <span className="font-mono text-sm flex-1">{r}</span>
                  <button onClick={() => setResults(results.filter(x => x !== r))} className="text-[var(--text-dim)] hover:text-[var(--danger)]">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setFile(null); setPreview(null); setResults([]) }} className="btn btn-ghost flex-1">
                Scan Another
              </button>
              <button onClick={confirm} className="btn btn-primary flex-1">
                Add to analysis <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex justify-center">
        {!preview && !results.length && (
          <button onClick={() => document.querySelector('input')?.click()} className="md:hidden btn btn-primary w-full">
            <Upload size={18} /> Open Camera
          </button>
        )}
        {preview && !scanning && !results.length && (
          <button onClick={analyze} className="btn btn-primary w-full shadow-lg shadow-emerald-900/40">
            Run OCR <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

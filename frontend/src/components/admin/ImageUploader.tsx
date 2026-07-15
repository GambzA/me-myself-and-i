import { useRef, useState } from 'react'
import { api, ApiError } from '../../lib/api'

interface ImageUploaderProps {
  label: string
  value: string
  onChange: (url: string) => void
}

export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    try {
      const result = await api.upload<{ url: string }>('/api/admin/uploads', file)
      onChange(result.url)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <span className="mb-1 block text-xs text-text-muted uppercase">{label}</span>

      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover" />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-text-dim">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:border-accent hover:text-text disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:border-red-400 hover:text-red-400"
              >
                Remove
              </button>
            )}
          </div>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

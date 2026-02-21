'use client'
import { useEffect } from 'react'

export function CalendlyWidget({ url }: { url: string }) {
  useEffect(() => {
    if (!url) return
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [url])

  if (!url) {
    return (
      <div className="w-full h-48 bg-brand-light rounded-xl flex items-center justify-center text-brand-muted">
        Выбор времени загружается...
      </div>
    )
  }

  return (
    <div
      className="calendly-inline-widget w-full rounded-xl overflow-hidden"
      data-url={url}
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}

import { useEffect } from 'react'
import { useUiStore } from '../../store/uiStore'
import Badge from '../ui/Badge'

function ToastItem({ toast }) {
  const removeToast = useUiStore((state) => state.removeToast)

  useEffect(() => {
    const timeout = window.setTimeout(() => removeToast(toast.id), 2800)
    return () => window.clearTimeout(timeout)
  }, [removeToast, toast.id])

  return (
    <div className="ruk-card p-3" role="status">
      <Badge tone={toast.tone}>{toast.tone === 'success' ? 'Berhasil' : 'Info'}</Badge>
      <p className="mb-0 mt-2 fw-semibold">{toast.message}</p>
    </div>
  )
}

function ToastAlert() {
  const toasts = useUiStore((state) => state.toasts)

  if (!toasts.length) return null

  return (
    <div className="ruk-toast-stack">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastAlert

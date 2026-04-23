import Button from './Button'

function Modal({ open, title, children, onClose }) {
  if (!open) return null

  return (
    <div aria-modal="true" className="fixed inset-0 z-[1050] overflow-y-auto" role="dialog">
      <div className="fixed inset-0 bg-ruk-navy/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-ruk-navy">{title}</h2>
            <button aria-label="Tutup modal" className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-ruk-primary rounded-full p-1 transition-colors" onClick={onClose} type="button">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6 text-slate-600">{children}</div>
          <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-slate-100">
            <Button onClick={onClose} variant="outline">Tutup</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal

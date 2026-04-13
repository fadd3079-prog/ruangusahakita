import Button from './Button'

function Modal({ open, title, children, onClose }) {
  if (!open) return null

  return (
    <div aria-modal="true" className="modal d-block" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5">{title}</h2>
            <button aria-label="Tutup modal" className="btn-close" onClick={onClose} type="button" />
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <Button onClick={onClose} variant="outline">Tutup</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal

"use client"

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  const handleOverlayMouseDown = (e) => {
    // Solo permitir cerrar con mousedown, no con click/mouseup
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="modal-overlay" 
      onMouseDown={handleOverlayMouseDown}
    >
      <div className="modal-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text hover:text-text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
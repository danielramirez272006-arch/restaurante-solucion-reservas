function Modal({ title, children, onClose }) {
	return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" type="button" aria-label="Cerrar" onClick={onClose}>×</button><h2 id="modal-title">{title}</h2>{children}</section></div>
}

export default Modal


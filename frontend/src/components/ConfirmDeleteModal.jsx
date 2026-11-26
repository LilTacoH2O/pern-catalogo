// HU04 · Confirmación antes de eliminar: Cancelar conserva el producto
export default function ConfirmDeleteModal({ product, onCancel, onConfirm, deleting = false }) {
  if (!product) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-xl font-bold">¿Eliminar producto?</h3>
        <p className="py-4">
          Se retirará <strong>{product.name}</strong> del catálogo. Esta acción no se puede deshacer.
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onCancel} disabled={deleting}>Cancelar</button>
          <button className="btn btn-error" onClick={onConfirm} disabled={deleting}>
            {deleting && <span className="loading loading-spinner loading-sm" />}
            Eliminar
          </button>
        </div>
      </div>
    </dialog>
  );
}

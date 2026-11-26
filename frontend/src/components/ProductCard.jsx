import { Pencil, Trash2 } from "lucide-react";

// Presenta un producto recibido por props: nombre, precio e imagen
// onEdit muestra el botón Editar (HU03) y onDelete el botón Eliminar (HU04)
export default function ProductCard({ product, onEdit, onDelete }) {
  const precio = Number(product.price).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  return (
    <article className="card bg-base-100 shadow-md">
      <figure className="h-48 bg-base-300">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p className="text-2xl font-bold text-primary">{precio}</p>
        {(onEdit || onDelete) && (
          <div className="card-actions justify-end">
            {onEdit && (
              <button className="btn btn-outline btn-sm" onClick={() => onEdit(product)}>
                <Pencil className="size-4" />
                Editar
              </button>
            )}
            {onDelete && (
              <button className="btn btn-error btn-outline btn-sm" onClick={() => onDelete(product)}>
                <Trash2 className="size-4" />
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

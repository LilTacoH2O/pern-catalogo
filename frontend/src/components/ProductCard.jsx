// Presenta un producto recibido por props: nombre, precio e imagen
export default function ProductCard({ product }) {
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
      </div>
    </article>
  );
}

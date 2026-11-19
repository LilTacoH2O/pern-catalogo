import { useEffect } from "react";
import { PackageOpen, RefreshCw } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  // Al montar la página se pide el catálogo a la API
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos disponibles</h1>
        <button className="btn btn-ghost btn-circle" onClick={fetchProducts} title="Recargar">
          <RefreshCw className="size-5" />
        </button>
      </div>

      {error && <div role="alert" className="alert alert-error mb-6">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : products.length === 0 && !error ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <PackageOpen className="size-16 text-base-content/40" />
          <h2 className="text-2xl font-semibold">No hay productos en el catálogo</h2>
          <p className="text-base-content/60">Cuando se registre un producto aparecerá aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

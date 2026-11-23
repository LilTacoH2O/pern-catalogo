import { useEffect, useState } from "react";
import { PackageOpen, RefreshCw, Search } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Al montar la página se pide el catálogo a la API
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    setAppliedSearch(query);
    fetchProducts(query);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos disponibles</h1>
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => fetchProducts(appliedSearch)}
          title="Recargar"
        >
          <RefreshCw className="size-5" />
        </button>
      </div>

      <form className="mb-6 flex gap-2" onSubmit={handleSearch}>
        <input
          className="input input-bordered w-full"
          type="search"
          name="search"
          placeholder="Buscar producto por nombre"
          aria-label="Buscar producto por nombre"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn btn-primary" type="submit" aria-label="Buscar">
          <Search className="size-5" />
          Buscar
        </button>
      </form>

      {error && <div role="alert" className="alert alert-error mb-6">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : products.length === 0 && !error ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <PackageOpen className="size-16 text-base-content/40" />
          {appliedSearch ? (
            <h2 className="text-2xl font-semibold">No se encontraron productos</h2>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">No hay productos en el catálogo</h2>
              <p className="text-base-content/60">Cuando se registre un producto aparecerá aquí.</p>
            </>
          )}
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

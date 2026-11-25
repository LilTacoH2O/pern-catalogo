import { useEffect, useState } from "react";
import { PackageOpen, Plus, RefreshCw, Search } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";

export default function HomePage() {
  const { products, loading, error, fetchProducts, createProduct } = useProductStore();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  // HU02 · alta de producto
  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

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

  const handleCreate = async (data) => {
    setSaving(true);
    setCreateError("");
    const result = await createProduct(data);
    setSaving(false);
    if (result.ok) {
      setShowCreate(false);
      setNotice(`Producto "${data.name.trim()}" registrado.`);
    } else {
      setCreateError(result.message); // el modal queda abierto con los datos capturados
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos disponibles</h1>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => { setCreateError(""); setShowCreate(true); }}>
            <Plus className="size-5" />
            Agregar producto
          </button>
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => fetchProducts(appliedSearch)}
            title="Recargar"
          >
            <RefreshCw className="size-5" />
          </button>
        </div>
      </div>

      {notice && (
        <div role="status" className="alert alert-success mb-6">
          <span>{notice}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setNotice("")}>Cerrar</button>
        </div>
      )}

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
      {showCreate && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-xl font-bold">Agregar producto</h3>
            {createError && <div role="alert" className="alert alert-error mb-4">{createError}</div>}
            <ProductForm onSubmit={handleCreate} submitLabel="Guardar producto" submitting={saving} />
            <button className="btn btn-ghost mt-2 w-full" onClick={() => setShowCreate(false)}>Cancelar</button>
          </div>
        </dialog>
      )}
    </main>
  );
}

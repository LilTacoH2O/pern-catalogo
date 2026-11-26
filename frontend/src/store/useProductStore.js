import { create } from "zustand";
import { api, mensajeDeError } from "../lib/api"; // INV01: cliente que envía el token

// Estado del catálogo compartido entre componentes
export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (search = "") => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/products", {
        params: search ? { search } : {},
      });
      set({ products: response.data.data });
    } catch (err) {
      console.error("Error al cargar productos:", err.message);
      set({ products: [], error: "No se pudo cargar el catálogo. Revisa que la API esté encendida." });
    } finally {
      set({ loading: false });
    }
  },

  // HU02 · POST /api/products
  createProduct: async (data) => {
    try {
      const response = await api.post("/api/products", data);
      // El producto nuevo se agrega al inicio de la lista sin recargar la página
      set({ products: [response.data.data, ...get().products] });
      return { ok: true };
    } catch (err) {
      return { ok: false, message: mensajeDeError(err) };
    }
  },

  // HU03 · PUT /api/products/:id
  updateProduct: async (id, data) => {
    try {
      const response = await api.put(`/api/products/${id}`, data);
      // Se reemplaza el producto editado en la lista sin recargar la página
      set({ products: get().products.map((p) => (p.id === id ? response.data.data : p)) });
      return { ok: true };
    } catch (err) {
      return { ok: false, message: mensajeDeError(err) };
    }
  },

  // HU04 · DELETE /api/products/:id
  deleteProduct: async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      // Se quita de la lista solo cuando la API confirma
      set({ products: get().products.filter((p) => p.id !== id) });
      return { ok: true };
    } catch (err) {
      if (err.response?.status === 404) {
        // Ya no existía en la base: también se quita de la vista
        set({ products: get().products.filter((p) => p.id !== id) });
      }
      return { ok: false, status: err.response?.status, message: mensajeDeError(err) };
    }
  },
}));

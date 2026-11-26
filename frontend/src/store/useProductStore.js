import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Convierte la respuesta de error de la API en un mensaje legible
const mensajeDeError = (err) => {
  const data = err.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(". ");
  if (data?.message) return data.message;
  return "No se pudo conectar con la API.";
};

// Estado del catálogo compartido entre componentes
export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (search = "") => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
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
      const response = await axios.post(`${API_URL}/api/products`, data);
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
      const response = await axios.put(`${API_URL}/api/products/${id}`, data);
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
      await axios.delete(`${API_URL}/api/products/${id}`);
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

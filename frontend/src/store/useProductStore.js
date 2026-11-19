import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Estado del catálogo compartido entre componentes
export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      set({ products: response.data.data });
    } catch (err) {
      console.error("Error al cargar productos:", err.message);
      set({ products: [], error: "No se pudo cargar el catálogo. Revisa que la API esté encendida." });
    } finally {
      set({ loading: false });
    }
  },
}));

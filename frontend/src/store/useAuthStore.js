import { create } from "zustand";
import { api, leerSesion, guardarSesion, mensajeDeError } from "../lib/api";

// INV01 · Qué puede hacer cada rol en la interfaz (la API vuelve a revisarlo)
const PERMISOS = {
  crear: ["admin", "editor"],
  editar: ["admin", "editor"],
  eliminar: ["admin"],
};

const inicial = leerSesion();

export const useAuthStore = create((set, get) => ({
  user: inicial?.user ?? null,
  token: inicial?.token ?? null,

  login: async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token, user } = response.data.data;
      guardarSesion({ token, user });
      set({ token, user });
      return { ok: true };
    } catch (err) {
      return { ok: false, message: mensajeDeError(err) };
    }
  },

  logout: () => {
    guardarSesion(null);
    set({ token: null, user: null });
  },

  // can("eliminar") -> true solo si el rol del usuario tiene ese permiso
  can: (accion) => Boolean(get().user && PERMISOS[accion]?.includes(get().user.role)),
}));

// Si la API responde 401 (token vencido o alterado) se cierra la sesión local
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

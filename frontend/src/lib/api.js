import axios from "axios";

// URL base de la API. En local viene de .env (VITE_API_URL); en el despliegue (HU05)
// React y la API comparten dominio, así que se usan rutas relativas ("").
export const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:3000");

// Cliente HTTP único: todas las peticiones a la API pasan por aquí
export const api = axios.create({ baseURL: API_URL });

// INV01 · La sesión (token + usuario) se guarda en el navegador
const CLAVE_SESION = "catalogo_sesion";

export const leerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION)) ?? null;
  } catch {
    return null;
  }
};

export const guardarSesion = (sesion) => {
  try {
    if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    else localStorage.removeItem(CLAVE_SESION);
  } catch {
    // Sin acceso a localStorage la sesión dura solo mientras la página esté abierta
  }
};

// INV01 · Cada petición lleva el token en el encabezado Authorization
api.interceptors.request.use((config) => {
  const sesion = leerSesion();
  if (sesion?.token) config.headers.Authorization = `Bearer ${sesion.token}`;
  return config;
});

// Convierte la respuesta de error de la API en un mensaje legible
export const mensajeDeError = (err) => {
  const data = err.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(". ");
  if (data?.message) return data.message;
  return "No se pudo conectar con la API.";
};

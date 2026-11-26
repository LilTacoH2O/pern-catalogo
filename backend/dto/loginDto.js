import { z } from "zod";

// INV01 · Datos que acepta POST /api/auth/login
export const loginSchema = z.object({
  email: z.string({ message: "El correo es obligatorio" }).trim().toLowerCase()
    .email("Escribe un correo válido"),
  password: z.string({ message: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria").max(100, "La contraseña es demasiado larga"),
});

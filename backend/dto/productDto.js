import { z } from "zod";

// DTO de entrada: solo estos tres campos cruzan la interfaz HTTP.
// Cualquier otro campo que llegue en el body se descarta.
export const productSchema = z.object({
  name: z
    .string({ message: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre no puede estar vacío")
    .max(255, "El nombre admite máximo 255 caracteres"),
  price: z.coerce
    .number({ message: "El precio debe ser numérico" })
    .positive("El precio debe ser mayor que cero")
    .max(99999999.99, "El precio es demasiado grande"),
  image: z
    .string({ message: "La imagen es obligatoria" })
    .trim()
    .url("La imagen debe ser una URL válida (http o https)")
    .max(500, "La URL admite máximo 500 caracteres"),
});

import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
// Encabezados HTTP de seguridad. La política CSP permite imágenes externas por https
// (las URL de los productos) y deja todo lo demás solo del mismo dominio (HU05)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: { "img-src": ["'self'", "data:", "https:"] },
    },
  })
);
// registra método, ruta y código HTTP (se omite al correr las pruebas)
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use("/api/auth", authRoutes); // INV01
app.use("/api/products", productRoutes);

// HU05 · En producción la misma app sirve el build de React (frontend/dist),
// así la API y la interfaz quedan en una sola URL y no hace falta CORS.
if (process.env.NODE_ENV === "production") {
  const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "../frontend/dist");
  app.use(express.static(dist));
  // Cualquier ruta que no sea /api (por ejemplo /login) la resuelve React Router
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(dist, "index.html")));
}

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

// JSON mal formado u otro error no controlado
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "El cuerpo de la petición no es JSON válido" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Error interno del servidor" });
});

// app se exporta sin escuchar el puerto para poder probarla con Supertest (HU02)
export default app;

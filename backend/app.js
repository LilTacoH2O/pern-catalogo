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
app.use(helmet());      // encabezados HTTP de seguridad
// registra método, ruta y código HTTP (se omite al correr las pruebas)
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use("/api/auth", authRoutes); // INV01
app.use("/api/products", productRoutes);

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

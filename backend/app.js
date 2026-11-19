import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(helmet());      // encabezados HTTP de seguridad
app.use(morgan("dev")); // registra método, ruta y código HTTP

app.use("/api/products", productRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

// app se exporta sin escuchar el puerto para poder probarla con Supertest (HU02)
export default app;

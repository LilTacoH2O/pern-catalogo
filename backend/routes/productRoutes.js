import express from "express";
import { getProducts } from "../controllers/productController.js";

const router = express.Router();

// La ruta solo delega la operación al controlador
router.get("/", getProducts);

export default router;

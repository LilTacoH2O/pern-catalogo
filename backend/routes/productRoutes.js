import express from "express";
import { getProducts, createProduct } from "../controllers/productController.js";
import { validateBody } from "../middleware/validate.js";
import { productSchema } from "../dto/productDto.js";

const router = express.Router();

// Las rutas solo delegan cada operación a un controlador
router.get("/", getProducts);
router.post("/", validateBody(productSchema), createProduct); // HU02

export default router;

import express from "express";
import { getProducts, createProduct, updateProduct } from "../controllers/productController.js";
import { validateBody, validateId } from "../middleware/validate.js";
import { productSchema } from "../dto/productDto.js";

const router = express.Router();

// Las rutas solo delegan cada operación a un controlador
router.get("/", getProducts);
router.post("/", validateBody(productSchema), createProduct); // HU02
router.put("/:id", validateId, validateBody(productSchema), updateProduct); // HU03

export default router;

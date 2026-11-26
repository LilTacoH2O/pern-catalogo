import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { validateBody, validateId } from "../middleware/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { productSchema } from "../dto/productDto.js";

const router = express.Router();

// Consulta pública: cualquiera puede ver el catálogo (HU01, HU06)
router.get("/", getProducts);

// INV01 · Permisos por rol
//   admin  -> alta, edición y baja
//   editor -> alta y edición (baja responde 403)
router.post("/", requireAuth, requireRole("admin", "editor"), validateBody(productSchema), createProduct); // HU02
router.put("/:id", requireAuth, requireRole("admin", "editor"), validateId, validateBody(productSchema), updateProduct); // HU03
router.delete("/:id", requireAuth, requireRole("admin"), validateId, deleteProduct); // HU04

export default router;

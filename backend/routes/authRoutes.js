import express from "express";
import { login, me } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema } from "../dto/loginDto.js";

const router = express.Router();

router.post("/login", validateBody(loginSchema), login); // INV01
router.get("/me", requireAuth, me); // INV01

export default router;

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

const CREDENCIALES_INVALIDAS = { success: false, message: "Correo o contraseña incorrectos" };

// POST /api/auth/login -> devuelve un JWT con el rol del usuario (INV01)
export const login = async (req, res) => {
  const { email, password } = req.body; // ya validado por loginSchema
  try {
    const [user] = await sql`
      SELECT id, name, email, password_hash, role FROM users WHERE email = ${email}
    `;
    // Mismo mensaje si el correo no existe o la contraseña no coincide
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json(CREDENCIALES_INVALIDAS);
    }
    const token = jwt.sign(
      { sub: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );
    res.status(200).json({
      success: true,
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (error) {
    console.error("Error en login:", error.message);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// GET /api/auth/me -> datos de la sesión actual (requiere token)
export const me = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

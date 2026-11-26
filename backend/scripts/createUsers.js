// Crea o actualiza los usuarios de práctica usando ADMIN_PASSWORD y EDITOR_PASSWORD.
import bcrypt from "bcryptjs";
import "dotenv/config";
import { sql } from "../config/db.js";

const usuarios = [
  {
    name: "Administrador",
    email: "admin@catalogo.test",
    role: "admin",
    password: process.env.ADMIN_PASSWORD,
  },
  {
    name: "Editor",
    email: "editor@catalogo.test",
    role: "editor",
    password: process.env.EDITOR_PASSWORD,
  },
];

for (const usuario of usuarios) {
  if (!usuario.password || usuario.password.length < 8) {
    throw new Error(
      `Falta ${usuario.role.toUpperCase()}_PASSWORD en .env (mínimo 8 caracteres)`,
    );
  }
}

for (const usuario of usuarios) {
  const hash = await bcrypt.hash(usuario.password, 10);
  await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${usuario.name}, ${usuario.email}, ${hash}, ${usuario.role})
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role
  `;
  console.log(`Usuario listo: ${usuario.email} (${usuario.role})`);
}

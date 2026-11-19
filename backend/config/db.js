import { neon } from "@neondatabase/serverless";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL en el archivo .env (revisa .env.example)");
}

// sql`...` ejecuta consultas parametrizadas en PostgreSQL (Neon)
export const sql = neon(process.env.DATABASE_URL);

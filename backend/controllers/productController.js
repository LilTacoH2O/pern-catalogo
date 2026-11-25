import { sql } from "../config/db.js";

// GET /api/products -> lista de productos guardados en PostgreSQL
export const getProducts = async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const products = search
      ? await sql`
          SELECT id, name, price, image, created_at
          FROM products
          WHERE name ILIKE ${`%${search}%`}
          ORDER BY created_at DESC, id DESC
        `
      : await sql`
          SELECT id, name, price, image, created_at
          FROM products
          ORDER BY created_at DESC, id DESC
        `;
    // Campo de datos acordado: "data" (lista vacía si no hay productos)
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error en getProducts:", error.message);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// POST /api/products -> registra un producto (HU02)
// req.body ya viene validado por Zod (DTO con name, price e image)
export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;
  try {
    // Consulta parametrizada: los valores viajan como parámetros, no como texto del SQL
    const [product] = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING id, name, price, image, created_at
    `;
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Error en createProduct:", error.message);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

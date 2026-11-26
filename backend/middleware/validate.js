// Valida req.body con un esquema de Zod antes de llegar al controlador.
// Si falla responde 400 y el controlador nunca se ejecuta (no se toca la base).
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Datos inválidos",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }
  req.body = result.data; // DTO ya limpio: name sin espacios, price numérico
  next();
};

// Valida que :id sea un entero positivo; si no, responde 400 sin tocar la base (HU03)
export const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "El id debe ser un número entero positivo" });
  }
  req.params.id = id;
  next();
};

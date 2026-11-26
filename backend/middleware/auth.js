import jwt from "jsonwebtoken";

// INV01 · Autenticación: ¿quién eres?  Sin token válido -> 401
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [tipo, token] = header.split(" ");
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Inicia sesión para continuar" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, name: payload.name, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Sesión inválida o expirada" });
  }
};

// INV01 · Autorización: ¿qué puedes hacer?  Rol sin permiso -> 403
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: "No tienes permiso para esta acción" });
  }
  next();
};

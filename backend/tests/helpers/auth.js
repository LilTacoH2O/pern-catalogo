import jwt from "jsonwebtoken";

// Las pruebas firman sus propios tokens con un secreto de prueba (no el real)
process.env.JWT_SECRET = "secreto-solo-para-pruebas";

// Encabezado Authorization con un token válido del rol indicado
export const authHeader = (role = "admin") => ({
  Authorization: `Bearer ${jwt.sign({ sub: 1, name: `Usuario ${role}`, role }, process.env.JWT_SECRET, { expiresIn: "5m" })}`,
});

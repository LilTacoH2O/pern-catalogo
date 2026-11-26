import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authHeader } from "./helpers/auth.js";

const sql = jest.fn();
jest.unstable_mockModule("../config/db.js", () => ({ sql }));

const { default: request } = await import("supertest");
const { default: app } = await import("../app.js");

// Usuario simulado tal como estaría en la tabla users (contraseña con hash)
const hash = await bcrypt.hash("Clave-Segura-123", 4);
const admin = { id: 1, name: "Administrador", email: "admin@catalogo.test", password_hash: hash, role: "admin" };
const producto = { name: "Lámpara", price: 459.9, image: "https://placehold.co/600x400/png?text=Lampara" };

describe("INV01 · Login con JWT", () => {
  beforeEach(() => sql.mockReset());

  it("credenciales correctas responden 200 con token y rol, sin exponer el hash", async () => {
    sql.mockResolvedValueOnce([admin]);
    const res = await request(app).post("/api/auth/login")
      .send({ email: "  ADMIN@catalogo.test ", password: "Clave-Segura-123" });

    expect(res.status).toBe(200);
    expect(res.body.data.user).toEqual({ id: 1, name: "Administrador", email: "admin@catalogo.test", role: "admin" });
    expect(jwt.verify(res.body.data.token, process.env.JWT_SECRET).role).toBe("admin");
    expect(JSON.stringify(res.body)).not.toContain("password_hash");
    expect(sql.mock.calls[0].slice(1)).toEqual(["admin@catalogo.test"]); // correo normalizado y parametrizado
  });

  it("contraseña incorrecta responde 401", async () => {
    sql.mockResolvedValueOnce([admin]);
    const res = await request(app).post("/api/auth/login").send({ email: admin.email, password: "otra-clave" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Correo o contraseña incorrectos");
  });

  it("correo que no existe responde 401 con el mismo mensaje", async () => {
    sql.mockResolvedValueOnce([]);
    const res = await request(app).post("/api/auth/login").send({ email: "nadie@catalogo.test", password: "x" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Correo o contraseña incorrectos");
  });

  it("correo con formato inválido responde 400 sin consultar la base", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "admin", password: "x" });
    expect(res.status).toBe(400);
    expect(sql).not.toHaveBeenCalled();
  });
});

describe("INV01 · Rutas protegidas y roles", () => {
  beforeEach(() => sql.mockReset());

  it("la consulta del catálogo sigue siendo pública (200 sin token)", async () => {
    sql.mockResolvedValueOnce([]);
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
  });

  it("alta sin token responde 401 y no toca la base", async () => {
    const res = await request(app).post("/api/products").send(producto);
    expect(res.status).toBe(401);
    expect(sql).not.toHaveBeenCalled();
  });

  it("token alterado o expirado responde 401", async () => {
    const vencido = jwt.sign({ sub: 1, role: "admin" }, process.env.JWT_SECRET, { expiresIn: -10 });
    const res1 = await request(app).delete("/api/products/3").set("Authorization", `Bearer ${vencido}`);
    const res2 = await request(app).delete("/api/products/3").set("Authorization", "Bearer abc.def.ghi");
    expect(res1.status).toBe(401);
    expect(res2.status).toBe(401);
  });

  it("editor puede editar pero eliminar responde 403", async () => {
    sql.mockResolvedValueOnce([{ id: 3, ...producto }]);
    const editar = await request(app).put("/api/products/3").set(authHeader("editor")).send(producto);
    const eliminar = await request(app).delete("/api/products/3").set(authHeader("editor"));

    expect(editar.status).toBe(200);
    expect(eliminar.status).toBe(403);
    expect(sql).toHaveBeenCalledTimes(1); // solo la edición llegó a la base
  });

  it("GET /api/auth/me devuelve la sesión del token", async () => {
    const res = await request(app).get("/api/auth/me").set(authHeader("editor"));
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("editor");
  });
});

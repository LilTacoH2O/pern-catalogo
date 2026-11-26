import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const sql = jest.fn();
jest.unstable_mockModule("../config/db.js", () => ({ sql }));

const { default: request } = await import("supertest");
const { default: app } = await import("../app.js");

describe("HU04 · DELETE /api/products/:id", () => {
  beforeEach(() => sql.mockReset());

  it("eliminar un producto existente responde 200 y devuelve el producto retirado", async () => {
    sql.mockResolvedValueOnce([{ id: 3, name: "Audífonos inalámbricos" }]);

    const res = await request(app).delete("/api/products/3");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(3);
    expect(sql.mock.calls[0].slice(1)).toEqual([3]); // id parametrizado
  });

  it("eliminar un ID que ya no existe responde 404", async () => {
    sql.mockResolvedValueOnce([]); // DELETE ... RETURNING sin filas

    const res = await request(app).delete("/api/products/3");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Producto no encontrado");
  });

  it("un ID inválido responde 400 sin consultar la base", async () => {
    const res = await request(app).delete("/api/products/-1");

    expect(res.status).toBe(400);
    expect(sql).not.toHaveBeenCalled();
  });
});

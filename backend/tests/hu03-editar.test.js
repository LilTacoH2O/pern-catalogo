import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Se reemplaza la conexión a Neon por un simulador: las pruebas no tocan la base real
const sql = jest.fn();
jest.unstable_mockModule("../config/db.js", () => ({ sql }));

const { default: request } = await import("supertest");
const { default: app } = await import("../app.js");

const valido = {
  name: "  Lámpara LED  ",
  price: 499.5,
  image: "https://placehold.co/600x400/png?text=Lampara",
};

describe("HU03 · PUT /api/products/:id", () => {
  beforeEach(() => sql.mockReset());

  it("edición válida responde 200 y devuelve el producto actualizado", async () => {
    sql.mockResolvedValueOnce([{ id: 5, name: "Lámpara LED", price: "499.50", image: valido.image }]);

    const res = await request(app).put("/api/products/5").send(valido);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ id: 5, name: "Lámpara LED" });
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it("usa consulta parametrizada con el DTO limpio y el id numérico", async () => {
    sql.mockResolvedValueOnce([{ id: 5 }]);

    await request(app).put("/api/products/5").send(valido);

    const valores = sql.mock.calls[0].slice(1); // [name, price, image, id]
    expect(valores).toEqual(["Lámpara LED", 499.5, valido.image, 5]);
  });

  it("id inexistente responde 404", async () => {
    sql.mockResolvedValueOnce([]);

    const res = await request(app).put("/api/products/999").send(valido);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("id que no es número responde 400 y no toca la base", async () => {
    const res = await request(app).put("/api/products/abc").send(valido);

    expect(res.status).toBe(400);
    expect(sql).not.toHaveBeenCalled();
  });

  it("precio negativo responde 400 y no modifica nada", async () => {
    const res = await request(app).put("/api/products/5").send({ ...valido, price: -5 });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe("price");
    expect(sql).not.toHaveBeenCalled();
  });

  it("nombre vacío responde 400", async () => {
    const res = await request(app).put("/api/products/5").send({ ...valido, name: "   " });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe("name");
    expect(sql).not.toHaveBeenCalled();
  });

  it("imagen que no es URL responde 400", async () => {
    const res = await request(app).put("/api/products/5").send({ ...valido, image: "foto.png" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe("image");
    expect(sql).not.toHaveBeenCalled();
  });
});

import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Se reemplaza la conexión a Neon por un simulador: las pruebas no tocan la base real
const sql = jest.fn();
jest.unstable_mockModule("../config/db.js", () => ({ sql }));

const { default: request } = await import("supertest");
const { default: app } = await import("../app.js");

const valido = {
  name: "  Lámpara de escritorio  ",
  price: 459.9,
  image: "https://placehold.co/600x400/png?text=Lampara",
};

describe("HU02 · POST /api/products", () => {
  beforeEach(() => sql.mockReset());

  it("alta válida responde 201 y devuelve el producto creado", async () => {
    sql.mockResolvedValueOnce([{ id: 5, name: "Lámpara de escritorio", price: "459.90", image: valido.image }]);

    const res = await request(app).post("/api/products").send(valido);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ id: 5, name: "Lámpara de escritorio" });
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it("guarda el nombre sin espacios al inicio ni al final (DTO limpio)", async () => {
    sql.mockResolvedValueOnce([{ id: 6 }]);

    await request(app).post("/api/products").send(valido);

    const valores = sql.mock.calls[0].slice(1); // [name, price, image] parametrizados
    expect(valores).toEqual(["Lámpara de escritorio", 459.9, valido.image]);
  });

  it("precio negativo responde 400 y no crea registro", async () => {
    const res = await request(app).post("/api/products").send({ ...valido, price: -10 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe("price");
    expect(sql).not.toHaveBeenCalled();
  });

  it("precio no numérico responde 400 y no crea registro", async () => {
    const res = await request(app).post("/api/products").send({ ...valido, price: "abc" });

    expect(res.status).toBe(400);
    expect(sql).not.toHaveBeenCalled();
  });

  it("nombre con solo espacios responde 400", async () => {
    const res = await request(app).post("/api/products").send({ ...valido, name: "    " });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe("name");
    expect(sql).not.toHaveBeenCalled();
  });

  it("imagen que no es URL responde 400", async () => {
    const res = await request(app).post("/api/products").send({ ...valido, image: "foto.png" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe("image");
    expect(sql).not.toHaveBeenCalled();
  });
});

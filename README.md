# pern-catalogo
# Catálogo de productos con PERN

Práctica guiada de la Unidad 4 de Ingeniería de Software (TecNM Celaya). Es una aplicación para consultar, crear, editar y eliminar productos de un comercio pequeño. Cada producto tiene identificador, nombre, precio e imagen por URL. Todos los datos son ficticios.

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Frontend | React + Vite, Zustand, Axios, React Router, Tailwind + DaisyUI | Presenta el catálogo y los formularios |
| API REST | Node.js + Express, helmet, morgan, cors, dotenv | Recibe la petición, ejecuta la operación y responde JSON |
| Base de datos | PostgreSQL en Neon (`@neondatabase/serverless`) | Guarda los productos y aplica las restricciones del esquema |

## Equipo

- Hernández López Clara Paulina
- Martínez Flores Javier Alexander
- Montalvo Cano Oscar Uriel
- Rodríguez Gutiérrez Leonardo
- Jairo

## Avance por jornada

| Jornada | Historia | Estado | Etiqueta |
|---|---|---|---|
| 1 | HU01 · Consultar catálogo | En revisión | `u4-j1` |
| 1 | HU06 · Buscar producto por nombre (función adicional) | Lista para iniciar | |
| 2 | HU02 · Dar de alta | Pendiente | |
| 3 | HU03 · Editar | Pendiente | |
| 4 | HU04 · Eliminar | Pendiente | |
| 5 | HU05 · Usar el catálogo publicado | Pendiente | |
| — | INV01 · Diseñar el acceso por roles | Pendiente | |

## Estructura

```
pern-catalogo/
├── backend/
│   ├── app.js                 # configura Express (middlewares y rutas)
│   ├── server.js              # arranca el servidor en PORT
│   ├── config/db.js           # conexión a Neon con sql`...`
│   ├── routes/productRoutes.js
│   ├── controllers/productController.js
│   ├── db/schema.sql          # tabla products
│   ├── db/seed.sql            # 2 productos de ejemplo
│   └── .env.example
└── frontend/
    ├── src/store/useProductStore.js   # estado del catálogo + Axios
    ├── src/pages/HomePage.jsx         # carga, vacío, error y lista
    ├── src/components/ProductCard.jsx
    ├── src/components/Navbar.jsx
    └── .env.example
```

## Requisitos

- Node.js 20.19 o superior y npm
- Una cuenta en [Neon](https://neon.tech) con un proyecto PostgreSQL
- Postman (o la extensión de Postman para VS Code), para probar la API

## Preparar PostgreSQL (Neon)

1. En Neon, crea un proyecto y abre **SQL Editor**.
2. Ejecuta el contenido de `backend/db/schema.sql` para crear la tabla `products`.
3. Ejecuta `backend/db/seed.sql` para cargar los dos productos de ejemplo.
4. Comprueba con `SELECT * FROM products;` que hay 2 filas.
5. Copia la cadena de conexión desde **Connect** para usarla en `DATABASE_URL`.

## Variables de entorno

Copia cada `.env.example` como `.env` y llena los valores. **El archivo `.env` no se sube a Git.**

| Archivo | Variable | Ejemplo | Para qué sirve |
|---|---|---|---|
| `backend/.env` | `PORT` | `3000` | Puerto de la API |
| `backend/.env` | `DATABASE_URL` | `postgresql://...neon.tech/neondb?sslmode=require` | Conexión a Neon |
| `backend/.env` | `CLIENT_URL` | `http://localhost:5173` | Origen de React permitido por CORS |
| `frontend/.env` | `VITE_API_URL` | `http://localhost:3000` | URL base de la API |

## Arranque en local

En una terminal, levanta la API:

```bash
cd backend
npm install
npm run dev
```

Debe aparecer `API escuchando en http://localhost:3000`.

En otra terminal, levanta el frontend:

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173.

## API

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/products` | `200` con `{ "success": true, "data": [ ...productos ] }`. Sin `search`, devuelve el catálogo completo; si no hay productos, `data` es `[]` |
| GET | `/api/products?search=termo` | Busca por coincidencia parcial del nombre, sin distinguir mayúsculas/minúsculas. Si no hay coincidencias, responde `200` con `data: []` |

Si la base de datos falla, responde `500` con `{ "success": false, "message": "Error interno del servidor" }`. Una ruta inexistente responde `404`.

## Pruebas

- **HU01:** prueba manual en Postman (`GET http://localhost:3000/api/products`) con dos pruebas automáticas en Post-response, que verifican el estado 200 y que `data` sea una lista. Se ejecutó con 2 productos y con la tabla vacía, y se demostró en React.
- **HU06:** probar en Postman con coincidencia (`?search=termo`), sin coincidencia y sin parámetro; la búsqueda se aplica desde el campo de la página principal.
- **HU02 en adelante:** pruebas automatizadas con Jest y Supertest (`npm test` en `backend`). Se agregan en la Jornada 2.

## Flujo de trabajo

- Tablero en GitHub Projects con las columnas **Pendiente → Lista para iniciar → En desarrollo → En revisión → Liberada**.
- Una rama por historia (por ejemplo `hu01-consultar-catalogo`), commits que mencionan la historia (`HU01 #1: ...`) y un pull request revisado por otro integrante.
- Al integrar en `main` se etiqueta el incremento (`u4-j1`, `u4-j2`, ...).

## Referencia

Basado en *Build a Product Store with Postgres & React* de Codesistency (repositorio `pern-crash-course`), reorganizado en jornadas.
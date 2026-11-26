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
- Melgar Obrajero Jairo Antonio

## Avance por jornada

| Jornada | Historia | Estado | Etiqueta |
|---|---|---|---|
| 1 | HU01 · Consultar catálogo | Liberada | `u4-j1` |
| 1 | HU06 · Buscar producto por nombre (función adicional) | Liberada | `u4-j1` |
| 2 | HU02 · Dar de alta | Liberada | `u4-j2` |
| 3 | HU03 · Editar | Liberada | `u4-j3` |
| 4 | HU04 · Eliminar | Liberada | `u4-j4` |
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
│   ├── dto/productDto.js      # esquema Zod de name, price e image
│   ├── middleware/validate.js # validateBody (400 con detalle) y validateId
│   ├── tests/                 # pruebas Jest + Supertest (HU02, HU03, HU04)
│   ├── db/schema.sql          # tabla products
│   ├── db/seed.sql            # 2 productos de ejemplo
│   └── .env.example
└── frontend/
    ├── src/store/useProductStore.js   # estado del catálogo + Axios (CRUD)
    ├── src/pages/HomePage.jsx         # lista, búsqueda y modales de alta, edición y baja
    ├── src/components/ProductForm.jsx # formulario reutilizable (alta y edición)
    ├── src/components/ConfirmDeleteModal.jsx
    ├── src/components/ProductCard.jsx # botones Editar y Eliminar
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
| POST | `/api/products` | `201` con el producto creado. Datos inválidos: `400` |
| PUT | `/api/products/:id` | `200` con el producto actualizado. Id inexistente: `404`. Datos o id inválidos: `400` |
| DELETE | `/api/products/:id` | `200` con el producto retirado. Id inexistente: `404`. Id inválido: `400` |

Cuerpo de POST y PUT: `{ "name": "Lámpara", "price": 459.9, "image": "https://..." }`.

### Validación (Zod)

| Campo | Regla |
|---|---|
| `name` | Texto obligatorio, se recortan espacios, 1 a 255 caracteres |
| `price` | Número mayor que cero |
| `image` | URL válida (http o https), máximo 500 caracteres |
| `:id` | Entero positivo |

Un error de validación responde `400` con `{ "success": false, "message": "Datos inválidos", "errors": [{ "field": "price", "message": "..." }] }` y no toca la base de datos.

Si la base de datos falla, responde `500` con `{ "success": false, "message": "Error interno del servidor" }`. Una ruta inexistente responde `404`.

## Pruebas

- **HU01:** prueba manual en Postman (`GET http://localhost:3000/api/products`) con dos pruebas automáticas en Post-response, que verifican el estado 200 y que `data` sea una lista. Se ejecutó con 2 productos y con la tabla vacía, y se demostró en React.
- **HU06:** probar en Postman con coincidencia (`?search=termo`), sin coincidencia y sin parámetro; la búsqueda se aplica desde el campo de la página principal.
- **HU02 a HU04:** pruebas automatizadas con Jest y Supertest. La base se simula, así que no se necesita Neon para correrlas:

```bash
cd backend
npm test
```

| Archivo | Casos | Qué verifica |
|---|---|---|
| `tests/hu02-alta.test.js` | 6 | Alta válida 201, DTO limpio, precio negativo o no numérico, nombre vacío e imagen inválida (400) |
| `tests/hu03-editar.test.js` | 7 | Edición válida 200, consulta parametrizada, id inexistente 404, id no numérico y datos inválidos (400) |
| `tests/hu04-eliminar.test.js` | 3 | Eliminación 200, id inexistente 404, id inválido 400 |

Resultado esperado: **16 pruebas pasan**.

## Flujo de trabajo

- Tablero en GitHub Projects con las columnas **Pendiente → Lista para iniciar → En desarrollo → En revisión → Liberada**.
- Una rama por historia (por ejemplo `hu01-consultar-catalogo`), commits que mencionan la historia (`HU01 #1: ...`) y un pull request revisado por otro integrante.
- Al integrar en `main` se etiqueta el incremento (`u4-j1`, `u4-j2`, ...).

## Referencia

Basado en *Build a Product Store with Postgres & React* de Codesistency (repositorio `pern-crash-course`), reorganizado en jornadas.
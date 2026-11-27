# pern-catalogo
# Catálogo de productos con PERN

Práctica guiada de la Unidad 4 de Ingeniería de Software (TecNM Celaya). Es una aplicación para consultar, crear, editar y eliminar productos de un comercio pequeño. Cada producto tiene identificador, nombre, precio e imagen por URL. Todos los datos son ficticios. Cualquiera puede consultar el catálogo; para agregar, editar o eliminar hay que iniciar sesión con un usuario que tenga el rol adecuado.

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Frontend | React + Vite, Zustand, Axios, React Router, Tailwind + DaisyUI | Presenta el catálogo y los formularios |
| API REST | Node.js + Express, helmet, morgan, cors, dotenv, Zod, bcryptjs, jsonwebtoken | Valida la petición y el rol, ejecuta la operación y responde JSON |
| Base de datos | PostgreSQL en Neon (`@neondatabase/serverless`) | Guarda productos y usuarios (con hash de contraseña) y aplica las restricciones del esquema |

**Aplicación publicada:** https://pern-catalogo.onrender.com

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
| 5 | HU05 · Usar el catálogo publicado | Liberada | `u4-j5` |
| — | INV01 · Diseñar el acceso por roles | Liberada | `u4-inv01` |

## Estructura

```
pern-catalogo/
├── backend/
│   ├── app.js                 # configura Express (middlewares y rutas)
│   ├── server.js              # arranca el servidor en PORT
│   ├── config/db.js           # conexión a Neon con sql`...`
│   ├── routes/productRoutes.js        # permisos por rol en cada ruta
│   ├── routes/authRoutes.js           # /api/auth/login y /api/auth/me
│   ├── controllers/productController.js
│   ├── controllers/authController.js  # bcrypt + JWT
│   ├── dto/productDto.js      # esquema Zod de name, price e image
│   ├── dto/loginDto.js        # esquema Zod de email y password
│   ├── middleware/validate.js # validateBody (400 con detalle) y validateId
│   ├── middleware/auth.js     # requireAuth (401) y requireRole (403)
│   ├── scripts/createUsers.js # crea los usuarios de práctica (npm run users)
│   ├── tests/                 # pruebas Jest + Supertest (HU02, HU03, HU04, INV01)
│   ├── db/schema.sql          # tabla products
│   ├── db/seed.sql            # 2 productos de ejemplo
│   ├── db/users.sql           # tabla users con rol
│   └── .env.example
└── frontend/
    ├── src/lib/api.js                 # cliente Axios que envía el token
    ├── src/store/useProductStore.js   # estado del catálogo (CRUD)
    ├── src/store/useAuthStore.js      # sesión y permisos por rol
    ├── src/pages/HomePage.jsx         # lista, búsqueda y modales según el rol
    ├── src/pages/LoginPage.jsx        # inicio de sesión
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
5. Ejecuta `backend/db/users.sql` para crear la tabla `users` (INV01).
6. Copia la cadena de conexión desde **Connect** para usarla en `DATABASE_URL`.

## Variables de entorno

Copia cada `.env.example` como `.env` y llena los valores. **El archivo `.env` no se sube a Git.**

| Archivo | Variable | Ejemplo | Para qué sirve |
|---|---|---|---|
| `backend/.env` | `PORT` | `3000` | Puerto de la API |
| `backend/.env` | `DATABASE_URL` | `postgresql://...neon.tech/neondb?sslmode=require` | Conexión a Neon |
| `backend/.env` | `CLIENT_URL` | `http://localhost:5173` | Origen de React permitido por CORS |
| `backend/.env` | `JWT_SECRET` | una cadena larga y aleatoria | Firma de los tokens de sesión (INV01) |
| `backend/.env` | `JWT_EXPIRES_IN` | `2h` | Duración de la sesión |
| `backend/.env` | `ADMIN_PASSWORD` / `EDITOR_PASSWORD` | mínimo 8 caracteres | Contraseñas de los usuarios de práctica; solo las usa `npm run users` |
| `frontend/.env` | `VITE_API_URL` | `http://localhost:3000` | URL base de la API |

## Arranque en local

En una terminal, levanta la API:

```bash
cd backend
npm install
npm run dev
```

Debe aparecer `API escuchando en http://localhost:3000`.

La primera vez, crea los usuarios de práctica (con `ADMIN_PASSWORD` y `EDITOR_PASSWORD` ya puestos en `backend/.env`):

```bash
cd backend
npm run users
```

En otra terminal, levanta el frontend:

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173.

## Despliegue (Render)

La aplicación se publica como **un solo servicio**: Express sirve la API en `/api` y, cuando `NODE_ENV=production`, también el build de React (`frontend/dist`). Así la interfaz y la API comparten dominio y no hace falta configurar CORS ni `VITE_API_URL`.

1. Neon ya debe tener las tablas `products` y `users` y los usuarios creados con `npm run users`.
2. En [Render](https://render.com) entra a **New → Web Service** y conecta este repositorio.
3. Configura el servicio:

| Campo | Valor |
|---|---|
| Branch | `main` |
| Root Directory | (vacío) |
| Runtime | Node |
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Instance Type | Free |

4. En **Environment** agrega las variables:

| Variable | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | la cadena de conexión de Neon |
| `JWT_SECRET` | una cadena larga y aleatoria, distinta de la de desarrollo |
| `JWT_EXPIRES_IN` | `2h` |

5. Presiona **Deploy**. Cuando el registro diga `API escuchando`, abre la URL `https://<servicio>.onrender.com`.
6. Comprueba desde otra computadora: el catálogo carga sin sesión, `/api/products` responde JSON y, con sesión, el CRUD respeta los permisos de cada rol.

En el plan gratuito el servicio se duerme tras 15 minutos sin uso; la primera visita después tarda alrededor de un minuto en responder.

Para probar el build de producción en local:

```bash
npm run build
NODE_ENV=production npm start   # en PowerShell: $env:NODE_ENV="production"; npm start
```

y abrir http://localhost:3000.

## API

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/products` | `200` con `{ "success": true, "data": [ ...productos ] }`. Sin `search`, devuelve el catálogo completo; si no hay productos, `data` es `[]` |
| GET | `/api/products?search=termo` | Busca por coincidencia parcial del nombre, sin distinguir mayúsculas/minúsculas. Si no hay coincidencias, responde `200` con `data: []` |
| POST | `/api/auth/login` | `200` con `{ token, user }`. Correo o contraseña incorrectos: `401`. Correo con formato inválido: `400` |
| GET | `/api/auth/me` | `200` con los datos de la sesión. Sin token: `401` |
| POST | `/api/products` | Rol `admin` o `editor`. `201` con el producto creado. Datos inválidos: `400` |
| PUT | `/api/products/:id` | Rol `admin` o `editor`. `200` con el producto actualizado. Id inexistente: `404`. Datos o id inválidos: `400` |
| DELETE | `/api/products/:id` | Solo rol `admin`. `200` con el producto retirado. Id inexistente: `404`. Id inválido: `400` |

Las rutas de escritura piden el encabezado `Authorization: Bearer <token>`. Sin token, o con un token alterado o vencido, responden `401`; con un rol sin permiso responden `403`.

### Roles y permisos (INV01)

| Acción | Visitante (sin sesión) | Editor | Administrador |
|---|---|---|---|
| Consultar y buscar | ✓ | ✓ | ✓ |
| Agregar | — (401) | ✓ | ✓ |
| Editar | — (401) | ✓ | ✓ |
| Eliminar | — (401) | — (403) | ✓ |

- Las contraseñas se guardan como hash de **bcrypt**, nunca en texto plano.
- Al iniciar sesión la API firma un **JWT** con el id y el rol; dura `JWT_EXPIRES_IN`.
- `requireAuth` comprueba el token (**401**) y `requireRole` el permiso (**403**). La interfaz oculta los botones que el rol no puede usar, pero la decisión final siempre la toma la API.
- Usuarios de práctica: `admin@catalogo.test` y `editor@catalogo.test`. Las contraseñas no se publican; se comparten dentro del equipo.

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
- **HU02 a HU04 e INV01:** pruebas automatizadas con Jest y Supertest. La base se simula, así que no se necesita Neon para correrlas:

```bash
cd backend
npm test
```

| Archivo | Casos | Qué verifica |
|---|---|---|
| `tests/hu02-alta.test.js` | 6 | Alta válida 201, DTO limpio, precio negativo o no numérico, nombre vacío e imagen inválida (400) |
| `tests/hu03-editar.test.js` | 7 | Edición válida 200, consulta parametrizada, id inexistente 404, id no numérico y datos inválidos (400) |
| `tests/hu04-eliminar.test.js` | 3 | Eliminación 200, id inexistente 404, id inválido 400 |
| `tests/inv01-auth.test.js` | 9 | Login 200 sin exponer el hash, contraseña o correo incorrectos 401, correo inválido 400, consulta pública 200, sin token 401, token alterado o vencido 401, editor eliminando 403, `/me` 200 |

Las pruebas firman sus propios tokens con un secreto de prueba (`tests/helpers/auth.js`). Resultado esperado: **25 pruebas pasan**.

## Flujo de trabajo

- Tablero en GitHub Projects con las columnas **Pendiente → Lista para iniciar → En desarrollo → En revisión → Liberada**.
- Una rama por historia (por ejemplo `hu01-consultar-catalogo`), commits que mencionan la historia (`HU01 #1: ...`) y un pull request revisado por otro integrante.
- Al integrar en `main` se etiqueta el incremento (`u4-j1`, `u4-j2`, ...).

## Referencia

Basado en *Build a Product Store with Postgres & React* de Codesistency (repositorio `pern-crash-course`), reorganizado en jornadas.

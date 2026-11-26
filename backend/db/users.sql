-- INV01: usuarios con rol para el acceso controlado.
-- Las contrasenas se almacenan como hashes bcrypt, nunca en texto plano.
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'editor')),
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

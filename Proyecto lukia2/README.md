# Minicrud Prueba

Proyecto mínimo CRUD usando Express, PostgreSQL y DataTables.

Estructura del proyecto
- `backend/` - servidor y lógica de negocio
  - `src/config/` - configuración (DB, env)
  - `src/controllers/` - lógica CRUD
  - `src/routes/` - endpoints API
  - `src/services/` - acceso a datos
  - `src/server.js` - servidor Express
- `frontend/` - interfaz de usuario
  - `public/` - archivos estáticos (DataTables UI)
- `db/` - cliente PostgreSQL
- `docs/` - documentación adicional
- `.env.example` - variables de entorno

Requisitos
- Node.js 16+ recomendado
- Una base de datos PostgreSQL (por ejemplo RDS en AWS). La tabla esperada tiene columnas:
  - id (serial, PK)
  - idu varchar(10)
  - name varchar(100)
  - email varchar(150)
  - password varchar(200)
  - rol varchar(50)
  - create_on timestamp
  - update_on timestamp

Ejemplo de tabla (si necesitas crearla):

```sql
CREATE TABLE users (
  id serial PRIMARY KEY,
  idu varchar(10) UNIQUE,
  name varchar(100),
  email varchar(150) UNIQUE,
  password varchar(200),
  rol varchar(50),
  create_on timestamp DEFAULT now(),
  update_on timestamp DEFAULT now()
);
```

Cómo configurar (Windows PowerShell)

1. Copia `.env.example` a `.env` y pon tus valores.
2. Instala dependencias:

```powershell
npm install
```

3. Ejecuta en modo desarrollo:

```powershell
npm run dev
```

4. Abre `http://localhost:3000` en tu navegador.

Notas sobre seguridad
- Las contraseñas se guardan hasheadas con bcrypt.
- En producción usa HTTPS y restringe acceso a la base de datos.

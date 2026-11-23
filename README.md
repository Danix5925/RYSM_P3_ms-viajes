# ms-viajes

Microservicio de viajes. Redes y Servicios Multimedia, Módulo 3.
Node.js + Express + MySQL, en capas: routes → controller → service → repository.

## Requisitos

- Node.js 22.9 o superior
- MySQL 8
- ms-usuarios corriendo en el puerto 3001 (emite los tokens JWT)

## Instalación

1. Instalar dependencias:

```
npm install
```

2. Crear la base de datos y la tabla (con un usuario administrador de MySQL):

```
mysql -u root -p < db/schema.sql
```

3. Crear el usuario de la base, con permisos solo sobre `viajes_db`:

```sql
CREATE USER 'viajes_user'@'localhost' IDENTIFIED BY '<clave>';
GRANT ALL PRIVILEGES ON viajes_db.* TO 'viajes_user'@'localhost';
FLUSH PRIVILEGES;
```

4. Copiar `.env.example` como `.env` y completar los valores. El archivo `.env` no se sube al repositorio.

## Variables de entorno

| Variable | Descripción |
|---|---|
| PORT | Puerto del servicio (3011) |
| HOST | Dirección donde escucha (127.0.0.1) |
| DB_HOST, DB_PORT | Servidor MySQL |
| DB_NAME | Base de datos (viajes_db) |
| DB_USER, DB_PASSWORD | Usuario de la base y su clave |
| JWT_SECRET | Misma clave con la que ms-usuarios firma los tokens |

## Ejecución

```
npm start
```

Para desarrollo (reinicia al cambiar un archivo): `npm run dev`. El servicio escucha en `http://127.0.0.1:3011`.

## Modelo

| Campo | Tipo | Regla |
|---|---|---|
| id | entero | Lo genera la base de datos |
| codigo | texto | Obligatorio, máximo 20 caracteres, único (409 si se repite) |
| origen | texto | Obligatorio, máximo 80 caracteres |
| destino | texto | Obligatorio, máximo 80 caracteres |
| fecha | fecha | Obligatoria, formato AAAA-MM-DD |
| pasajeros | entero | Obligatorio, mayor que 0 |

## Seguridad

Todas las rutas de `/viajes` exigen un token JWT en la cabecera `Authorization: Bearer <token>`.
El token se obtiene con `POST /usuarios/login` en ms-usuarios.

- GET: cualquier rol.
- POST, PUT y DELETE: solo el rol `administrador`.

## Contrato

| Método | Ruta | Rol | Éxito | Errores |
|---|---|---|---|---|
| GET | /health | público | 200 | |
| GET | /viajes | cualquiera | 200 arreglo (filtro `?destino=`) | 401 |
| GET | /viajes/:id | cualquiera | 200 viaje | 400 · 401 · 404 |
| POST | /viajes | administrador | 201 viaje creado | 400 · 401 · 403 · 409 |
| PUT | /viajes/:id | administrador | 200 viaje actualizado | 400 · 401 · 403 · 404 · 409 |
| DELETE | /viajes/:id | administrador | 204 sin cuerpo | 400 · 401 · 403 · 404 |

Códigos de error:

- 400: datos inválidos o id que no es un entero positivo.
- 401: falta el token o es inválido o está vencido.
- 403: el rol no tiene permiso para la operación.
- 404: el viaje no existe.
- 409: ya existe un viaje con ese código.

Los errores responden `{ "error": "mensaje" }`. En los 400 por datos inválidos se agrega `"detalles"` con la lista de problemas.

### Ejemplo

`POST /viajes`

```json
{
  "codigo": "VJ-010",
  "origen": "Cali",
  "destino": "Pasto",
  "fecha": "2026-12-28",
  "pasajeros": 2
}
```

Respuesta 201:

```json
{
  "id": 4,
  "codigo": "VJ-010",
  "origen": "Cali",
  "destino": "Pasto",
  "fecha": "2026-12-28",
  "pasajeros": 2
}
```

`GET /viajes?destino=Cartagena` devuelve solo los viajes con ese destino.

## Registro de peticiones

Cada petición se muestra en la terminal con la hora, el método, la ruta, el código de respuesta y el tiempo:

```
[9:15:20 PM] GET /viajes -> 401 (2 ms) · curl/8.22.0
```

## Pruebas

La colección de Postman está en `docs/ms-viajes.postman_collection.json` (32 pruebas: login, CRUD, 409, filtro, 401 y 403).
Se ejecuta con ms-usuarios (3001) y ms-viajes (3011) corriendo con el mismo `JWT_SECRET`. Ejecutar primero la carpeta `0 · Preparar tokens`.

## Estructura

```
db/schema.sql           tabla viajes y 3 registros iniciales
docs/                   colección de Postman
src/index.js            arranque del servidor
src/app.js              Express, registro de peticiones y manejo de errores
src/db.js               pool de conexiones MySQL
src/routes/             rutas y seguridad
src/controllers/        recibe la petición y arma la respuesta
src/services/           reglas y errores HTTP
src/repositories/       consultas SQL
src/models/             validación del viaje
src/middlewares/auth.js verificación del token y del rol
src/utils/http-error.js error con código HTTP
```
# ms-rutas · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de viajes, que guarda el atributo `ruta_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE rutas_db;
CREATE USER 'rutas_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON rutas_db.* TO 'rutas_user'@'localhost';
```

2. `mysql -u rutas_user -p rutas_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "nombre_ruta": "Cali - Buga", "ciudad_origen": "Cali", "ciudad_destino": "Buga"}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| nombre_ruta | texto |
| ciudad_origen | texto |
| ciudad_destino | texto |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /rutas | 200 arreglo | 401 |
| Consultar por lotes | GET | /rutas?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /rutas/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | nombre_ruta | ciudad_origen | ciudad_destino |
|---|---|---|---|
| 1 | Cali - Buga | Cali | Buga |
| 2 | Cali - Palmira | Cali | Palmira |
| 3 | Buga - Tuluá | Buga | Tuluá |
| 4 | Cali - Popayán | Cali | Popayán |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `rutas.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-viajes/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-viajes y ms-rutas. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/viajes` y `/api/rutas` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-viajes | `GET /rutas/:id` (validar) · `GET /rutas?ids=…` (componer) |

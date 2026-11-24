-- =====================================================================
-- Base de datos de ms-viajes
-- Se puede ejecutar varias veces: borra y recrea la tabla con 3 registros.
-- =====================================================================
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS viajes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE viajes_db;

DROP TABLE IF EXISTS viajes;

CREATE TABLE viajes (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  codigo    VARCHAR(20) NOT NULL UNIQUE,  -- UNIQUE: un código repetido se rechaza (409)
  origen    VARCHAR(80) NOT NULL,
  destino   VARCHAR(80) NOT NULL,
  fecha     DATE NOT NULL,
  pasajeros INT NOT NULL,
  ruta_id   INT NOT NULL                  -- id de la ruta en ms-rutas (el proveedor)
);

INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros, ruta_id) VALUES
  ('VJ-001', 'Cali', 'Buga',    '2026-12-05', 3, 1),
  ('VJ-002', 'Cali', 'Palmira', '2026-12-12', 2, 2),
  ('VJ-003', 'Buga', 'Tuluá',   '2026-12-20', 4, 3);
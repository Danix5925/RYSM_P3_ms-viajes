-- =====================================================================
-- Base de datos de ms-viajes
-- Se puede ejecutar varias veces: borra y recrea la tabla con 3 registros.
-- =====================================================================
CREATE DATABASE IF NOT EXISTS viajes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE viajes_db;

DROP TABLE IF EXISTS viajes;

CREATE TABLE viajes (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  codigo    VARCHAR(20) NOT NULL UNIQUE,  -- UNIQUE: un código repetido se rechaza (409)
  origen    VARCHAR(80) NOT NULL,
  destino   VARCHAR(80) NOT NULL,
  fecha     DATE NOT NULL,
  pasajeros INT NOT NULL
);

INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros) VALUES
  ('VJ-001', 'Cali',     'Bogota',    '2026-12-05', 3),
  ('VJ-002', 'Medellin', 'Cartagena', '2026-12-12', 2),
  ('VJ-003', 'Cali',     'Cartagena', '2026-12-20', 4);
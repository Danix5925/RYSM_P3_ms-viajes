-- db/schema.sql — base de datos de ms-rutas
SET NAMES utf8mb4;

CREATE TABLE rutas (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  nombre_ruta          VARCHAR(80) NOT NULL,
  ciudad_origen        VARCHAR(60) NOT NULL,
  ciudad_destino       VARCHAR(60) NOT NULL
);

INSERT INTO rutas (nombre_ruta, ciudad_origen, ciudad_destino) VALUES
  ('Cali - Buga', 'Cali', 'Buga'),
  ('Cali - Palmira', 'Cali', 'Palmira'),
  ('Buga - Tuluá', 'Buga', 'Tuluá'),
  ('Cali - Popayán', 'Cali', 'Popayán');

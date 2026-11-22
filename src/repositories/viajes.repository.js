// =====================================================================
// Repositorio: la única capa que habla con MySQL.
// Todas las consultas son parametrizadas (los ? evitan la inyección SQL).
// =====================================================================
const pool = require('../db');

// Lista todos los viajes o, si llega destino, solo los de ese destino
async function listar(destino) {
  if (destino) {
    const [filas] = await pool.query('SELECT * FROM viajes WHERE destino = ? ORDER BY id', [destino]);
    return filas;
  }
  const [filas] = await pool.query('SELECT * FROM viajes ORDER BY id');
  return filas;
}

async function buscarPorId(id) {
  const [filas] = await pool.query('SELECT * FROM viajes WHERE id = ?', [id]);
  return filas[0]; // undefined si no existe
}

async function buscarPorCodigo(codigo) {
  const [filas] = await pool.query('SELECT * FROM viajes WHERE codigo = ?', [codigo]);
  return filas[0];
}

// Inserta y devuelve el id que generó MySQL
async function crear(viaje) {
  const [resultado] = await pool.query(
    'INSERT INTO viajes (codigo, origen, destino, fecha, pasajeros) VALUES (?, ?, ?, ?, ?)',
    [viaje.codigo, viaje.origen, viaje.destino, viaje.fecha, viaje.pasajeros]
  );
  return resultado.insertId;
}

async function actualizar(id, viaje) {
  await pool.query(
    'UPDATE viajes SET codigo = ?, origen = ?, destino = ?, fecha = ?, pasajeros = ? WHERE id = ?',
    [viaje.codigo, viaje.origen, viaje.destino, viaje.fecha, viaje.pasajeros, id]
  );
}

async function eliminar(id) {
  await pool.query('DELETE FROM viajes WHERE id = ?', [id]);
}

module.exports = { listar, buscarPorId, buscarPorCodigo, crear, actualizar, eliminar };
// CAPA DE NEGOCIO: rutas
const repo = require('../repositories/rutas.repository');
const HttpError = require('../utils/http-error');

async function listar(ids) {
  return repo.findAll(ids);
}

async function obtener(id) {
  const fila = await repo.findById(id);
  if (!fila) throw new HttpError(404, `No existe el ruta con id ${id}`);
  return fila;
}

module.exports = { listar, obtener };

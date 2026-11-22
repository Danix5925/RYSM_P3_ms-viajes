// =====================================================================
// Servicio: las reglas del negocio y los errores HTTP.
// No sabe nada de Express ni de SQL: usa el modelo y el repositorio.
// =====================================================================
const HttpError = require('../utils/http-error');
const repository = require('../repositories/viajes.repository');
const { validarViaje } = require('../models/viaje');

// El id de la URL debe ser un entero positivo (si no, 400)
function validarId(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new HttpError(400, 'El id debe ser un entero positivo');
  }
  return numero;
}

// GET /viajes y GET /viajes?destino=
async function listar(destino) {
  return repository.listar(destino);
}

// GET /viajes/:id  (404 si no existe)
async function obtener(id) {
  const viaje = await repository.buscarPorId(validarId(id));
  if (!viaje) throw new HttpError(404, `No existe el viaje con id ${id}`);
  return viaje;
}

// POST /viajes  (400 datos inválidos, 409 código repetido)
async function crear(datos) {
  const viaje = validarViaje(datos);
  if (await repository.buscarPorCodigo(viaje.codigo)) {
    throw new HttpError(409, `Ya existe un viaje con el código ${viaje.codigo}`);
  }
  const id = await repository.crear(viaje);
  return repository.buscarPorId(id);
}

// PUT /viajes/:id  (404 no existe, 400 datos inválidos, 409 código de otro viaje)
async function actualizar(id, datos) {
  const idNumero = validarId(id);
  if (!(await repository.buscarPorId(idNumero))) {
    throw new HttpError(404, `No existe el viaje con id ${id}`);
  }
  const viaje = validarViaje(datos);
  const conMismoCodigo = await repository.buscarPorCodigo(viaje.codigo);
  if (conMismoCodigo && conMismoCodigo.id !== idNumero) {
    throw new HttpError(409, `Ya existe un viaje con el código ${viaje.codigo}`);
  }
  await repository.actualizar(idNumero, viaje);
  return repository.buscarPorId(idNumero);
}

// DELETE /viajes/:id  (404 si no existe)
async function eliminar(id) {
  const idNumero = validarId(id);
  if (!(await repository.buscarPorId(idNumero))) {
    throw new HttpError(404, `No existe el viaje con id ${id}`);
  }
  await repository.eliminar(idNumero);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
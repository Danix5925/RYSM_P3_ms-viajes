// =====================================================================
// Servicio: las reglas del negocio y los errores HTTP.
// No sabe nada de Express ni de SQL: usa el modelo y el repositorio.
// =====================================================================
const HttpError = require('../utils/http-error');
const repository = require('../repositories/viajes.repository');
const rutas = require('../clients/rutas.client');
const { validarViaje } = require('../models/viaje');

// El id de la URL debe ser un entero positivo (si no, 400)
function validarId(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new HttpError(400, 'El id debe ser un entero positivo');
  }
  return numero;
}



function mismaCiudad(a, b) {
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}


async function validarRelacion(viaje, token) {
  const ruta = await rutas.obtenerPorId(viaje.ruta_id, token);
  if (!ruta) {
    throw new HttpError(400, `La ruta con id ${viaje.ruta_id} no existe`);
  }
  if (
    !mismaCiudad(viaje.origen, ruta.ciudad_origen) ||
    !mismaCiudad(viaje.destino, ruta.ciudad_destino)
  ) {
    throw new HttpError(
      400,
      `El origen y el destino del viaje no coinciden con la ruta (${ruta.ciudad_origen} - ${ruta.ciudad_destino})`
    );
  }
  return ruta;
}

// GET /viajes y GET /viajes?destino=
async function listar(destino, token) {
  return repository.listar(destino);
}

// GET /viajes/:id  (404 si no existe)
async function obtener(id, token) {
  const viaje = await repository.buscarPorId(validarId(id));
  if (!viaje) throw new HttpError(404, `No existe el viaje con id ${id}`);
  return viaje;
}

// POST /viajes  (400 datos o ruta inválidos, 409 código repetido, 503 proveedor caído)
async function crear(datos, token) {
  const viaje = validarViaje(datos);
  await validarRelacion(viaje, token);
  if (await repository.buscarPorCodigo(viaje.codigo)) {
    throw new HttpError(409, `Ya existe un viaje con el código ${viaje.codigo}`);
  }
  const id = await repository.crear(viaje);
  return repository.buscarPorId(id);
}

// PUT /viajes/:id  (404 no existe, 400 datos o ruta inválidos, 409 código de otro viaje, 503)
async function actualizar(id, datos, token) {
  const idNumero = validarId(id);
  if (!(await repository.buscarPorId(idNumero))) {
    throw new HttpError(404, `No existe el viaje con id ${id}`);
  }
  const viaje = validarViaje(datos);
  await validarRelacion(viaje, token);
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
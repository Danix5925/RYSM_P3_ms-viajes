// =====================================================================
// Controlador: recibe la petición, llama al servicio y arma la respuesta.
// Los errores que lanza el servicio llegan solos al manejador de app.js.
// =====================================================================
const service = require('../services/viajes.service');


function tokenDe(req) {
  return req.headers.authorization;
}

async function listar(req, res) {
  res.json(await service.listar(req.query.destino, tokenDe(req)));
}

async function obtener(req, res) {
  res.json(await service.obtener(req.params.id, tokenDe(req)));
}

async function crear(req, res) {
  res.status(201).json(await service.crear(req.body, tokenDe(req)));
}

async function actualizar(req, res) {
  res.json(await service.actualizar(req.params.id, req.body, tokenDe(req)));
}

async function eliminar(req, res) {
  await service.eliminar(req.params.id);
  res.status(204).send(); // 204: borrado, sin cuerpo en la respuesta
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
// =====================================================================
// Cliente HTTP del proveedor ms-rutas.
// En el .env de ms-viajes:  RUTAS_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../utils/http-error');
const RUTAS_URL = process.env.RUTAS_URL;

// Hace una petición GET a ms-rutas reenviando el token del usuario.
// Devuelve la respuesta de fetch, o null si ms-rutas no respondió.
async function pedir(ruta, token) {
  try {
    return await fetch(`${RUTAS_URL}${ruta}`, {
      headers: { Authorization: token },     // el token de la petición original
      signal: AbortSignal.timeout(3000),      // no esperar más de 3 segundos
    });
  } catch (error) {
    return null;                              // ms-rutas caído o sin responder
  }
}


async function obtenerPorId(id, token) {
  const respuesta = await pedir(`/rutas/${id}`, token);
  if (!respuesta) throw new HttpError(503, 'El servicio de rutas no responde');
  if (respuesta.status === 404) return null;
  if (!respuesta.ok) throw new HttpError(503, 'El servicio de rutas respondió con error');
  return respuesta.json();
}


async function obtenerPorIds(ids, token) {
  const respuesta = await pedir(`/rutas?ids=${ids.join(',')}`, token);
  if (!respuesta || !respuesta.ok) return null;
  return respuesta.json();
}

module.exports = { obtenerPorId, obtenerPorIds };
// =====================================================================
// Modelo de viaje: define los campos y valida los datos que llegan.
// Campos: codigo, origen, destino, fecha (AAAA-MM-DD), pasajeros (entero > 0)
// Si algo está mal lanza un HttpError 400 con la lista de problemas.
// =====================================================================
const HttpError = require('../utils/http-error');

// Comprueba que el texto tenga formato AAAA-MM-DD y que sea una fecha real
function esFechaValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [anio, mes, dia] = texto.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

// Un texto obligatorio: tipo string, no vacío y no más largo que el máximo
function textoValido(valor, maximo) {
  return typeof valor === 'string' && valor.trim() !== '' && valor.trim().length <= maximo;
}

// Valida los datos y devuelve un objeto limpio (sin espacios sobrantes)
function validarViaje(datos) {
  const d = datos || {};
  const errores = [];

  if (!textoValido(d.codigo, 20)) errores.push('codigo es obligatorio (texto de máximo 20 caracteres)');
  if (!textoValido(d.origen, 80)) errores.push('origen es obligatorio (texto de máximo 80 caracteres)');
  if (!textoValido(d.destino, 80)) errores.push('destino es obligatorio (texto de máximo 80 caracteres)');
  if (typeof d.fecha !== 'string' || !esFechaValida(d.fecha)) {
    errores.push('fecha es obligatoria con formato AAAA-MM-DD');
  }
  if (!Number.isInteger(d.pasajeros) || d.pasajeros <= 0) {
    errores.push('pasajeros es obligatorio y debe ser un entero mayor que 0');
  }

  if (errores.length > 0) {
    throw new HttpError(400, 'Datos inválidos', errores);
  }

  return {
    codigo: d.codigo.trim(),
    origen: d.origen.trim(),
    destino: d.destino.trim(),
    fecha: d.fecha,
    pasajeros: d.pasajeros,
  };
}

module.exports = { validarViaje };
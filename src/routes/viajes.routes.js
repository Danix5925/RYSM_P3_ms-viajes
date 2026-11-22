// =====================================================================
// Rutas de /viajes y su seguridad.
// Todas exigen token. GET: cualquier rol. POST, PUT y DELETE: solo administrador.
// =====================================================================
const express = require('express');
const controller = require('../controllers/viajes.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

const router = express.Router();

router.use(verificarToken); // todas las rutas de abajo exigen token

router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', requiereRol('administrador'), controller.crear);
router.put('/:id', requiereRol('administrador'), controller.actualizar);
router.delete('/:id', requiereRol('administrador'), controller.eliminar);

module.exports = router;
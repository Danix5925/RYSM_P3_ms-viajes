// CAPA DE PRESENTACIÓN: rutas de rutas (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/rutas.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /rutas  y  GET /rutas?ids=1,3
router.get('/:id', controller.obtener);   // GET /rutas/:id

module.exports = router;

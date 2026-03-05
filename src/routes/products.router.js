const { Router } = require('express');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');
const { getAll, getById, create, update, remove, insertMany } = require('../controllers/products.controller');

const router = Router();

router.get('/',        getAll);
router.get('/:pid',    getById);

// Solo admin puede crear, actualizar y eliminar
router.post('/',       authenticate, isAdmin, create);
router.post('/bulk',   authenticate, isAdmin, insertMany);
router.put('/:pid',    authenticate, isAdmin, update);
router.delete('/:pid', authenticate, isAdmin, remove);

module.exports = router;

const { Router } = require('express');
const { authenticate, isUser } = require('../middlewares/auth.middleware');
const {
    create,
    getAll,
    getById,
    addProduct,
    removeProduct,
    updateProducts,
    updateProductQuantity,
    clearCart,
    deleteCart,
    purchase,
} = require('../controllers/carts.controller');

const router = Router();

router.post('/',                            create);
router.get('/',                             getAll);
router.get('/:cid',                         getById);

// Solo el usuario puede agregar productos a su carrito
router.post('/:cid/products/:pid',          authenticate, isUser, addProduct);
router.post('/:cid/purchase',               authenticate, isUser, purchase);

router.delete('/:cid/products/:pid',        removeProduct);
router.put('/:cid',                         updateProducts);
router.put('/:cid/products/:pid',           updateProductQuantity);
router.delete('/:cid/products',             clearCart);
router.delete('/:cid',                      deleteCart);

module.exports = router;

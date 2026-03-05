const productRepository = require('../repositories/product.repository');
const cartRepository = require('../repositories/cart.repository');

// GET /products
const renderProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;
        const query = category ? { category } : {};
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const result = await productRepository.getAll(query, options);
        res.render('home', {
            products:    result.docs.map(p => p.toObject()),
            totalPages:  result.totalPages,
            currentPage: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage:    result.prevPage,
            nextPage:    result.nextPage,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// GET /products/:pid
const renderProductDetail = async (req, res) => {
    try {
        const product = await productRepository.getById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');
        res.render('productDetail', { product: product.toObject() });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// GET /cart
const renderCart = async (req, res) => {
    try {
        const cartId = req.user?.cart;
        if (!cartId) return res.redirect('/login');

        const cart = await cartRepository.getByIdPopulated(cartId);
        res.render('cartDetail', { cart: cart ? cart.toObject() : null });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { renderProducts, renderProductDetail, renderCart };

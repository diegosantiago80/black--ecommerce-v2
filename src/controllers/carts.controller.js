const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');
const ticketRepository = require('../repositories/ticket.repository');

// POST /api/carts
const create = async (req, res) => {
    try {
        const cart = await cartRepository.create();
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// GET /api/carts
const getAll = async (req, res) => {
    try {
        const carts = await cartRepository.getAll();
        res.json({ status: 'success', payload: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// GET /api/carts/:cid
const getById = async (req, res) => {
    try {
        const cart = await cartRepository.getByIdPopulated(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// POST /api/carts/:cid/products/:pid  — solo user
const addProduct = async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(
            p => p.product.toString() === req.params.pid
        );

        if (productIndex >= 0) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cartRepository.save(cart);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// DELETE /api/carts/:cid/products/:pid
const removeProduct = async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(
            p => p.product.toString() !== req.params.pid
        );

        await cartRepository.save(cart);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// PUT /api/carts/:cid  — reemplaza array completo
const updateProducts = async (req, res) => {
    try {
        const cart = await cartRepository.update(req.params.cid, { products: req.body });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// PUT /api/carts/:cid/products/:pid  — actualiza cantidad
const updateProductQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartRepository.getById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        const item = cart.products.find(p => p.product.toString() === req.params.pid);
        if (!item) return res.status(404).json({ status: 'error', error: 'Producto no está en el carrito' });

        item.quantity = quantity;
        await cartRepository.save(cart);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// DELETE /api/carts/:cid/products  — vaciar carrito
const clearCart = async (req, res) => {
    try {
        const cart = await cartRepository.update(req.params.cid, { products: [] });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// DELETE /api/carts/:cid  — eliminar carrito
const deleteCart = async (req, res) => {
    try {
        await cartRepository.delete(req.params.cid);
        res.json({ status: 'success', message: 'Carrito eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// POST /api/carts/:cid/purchase  — loogica de compra con tickets
const purchase = async (req, res) => {
    try {
        const cart = await cartRepository.getByIdPopulated(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        let totalAmount = 0;
        const productosConStock = [];
        const productosSinStock = [];

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                // Hay stock: se puede comprar
                totalAmount += product.price * item.quantity;
                productosConStock.push(item);

                // Descontar stock
                await productRepository.update(product._id, {
                    stock: product.stock - item.quantity,
                });
            } else {
                // Sin stock suficiente: quedan en el carrito
                productosSinStock.push(item);
            }
        }

        // Generar ticket si hubo productos comprados
        let ticket = null;
        if (productosConStock.length > 0) {
            ticket = await ticketRepository.create({
                amount:    totalAmount,
                purchaser: req.user.email,
            });
        }

        // Actualizar carrito con solo los productos que no se pudieron comprar
        await cartRepository.update(req.params.cid, { products: productosSinStock });

        res.json({
            status: 'success',
            payload: {
                ticket,
                productosSinStock: productosSinStock.map(i => i.product._id),
            },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

module.exports = {
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
};

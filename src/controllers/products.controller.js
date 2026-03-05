const productRepository = require('../repositories/product.repository');

// GET /api/products
const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;

        const query = category ? { category } : {};
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const result = await productRepository.getAll(query, options);
        res.json({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// GET /api/products/:pid
const getById = async (req, res) => {
    try {
        const product = await productRepository.getById(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// POST /api/products  — solo admin
const create = async (req, res) => {
    try {
        const product = await productRepository.create(req.body);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// PUT /api/products/:pid  — solo admin
const update = async (req, res) => {
    try {
        const product = await productRepository.update(req.params.pid, req.body);
        if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// DELETE /api/products/:pid  — solo admin
const remove = async (req, res) => {
    try {
        const product = await productRepository.delete(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

// POST /api/products/bulk  — solo admin
const insertMany = async (req, res) => {
    try {
        const products = await productRepository.insertMany(req.body);
        res.status(201).json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
};

module.exports = { getAll, getById, create, update, remove, insertMany };

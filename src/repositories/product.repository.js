const productDAO = require('../dao/product.dao');

class ProductRepository {
    async getAll(query = {}, options = {}) {
        return productDAO.findAll(query, options);
    }

    async getById(id) {
        return productDAO.findById(id);
    }

    async create(productData) {
        return productDAO.create(productData);
    }

    async update(id, updateData) {
        return productDAO.updateById(id, updateData);
    }

    async delete(id) {
        return productDAO.deleteById(id);
    }

    async insertMany(products) {
        return productDAO.insertMany(products);
    }
}

module.exports = new ProductRepository();

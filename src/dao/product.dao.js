const Product = require('../models/product.model');

class ProductDAO {
    async findAll(query = {}, options = {}) {
        return Product.paginate(query, options);
    }

    async findById(id) {
        return Product.findById(id);
    }

    async create(productData) {
        return Product.create(productData);
    }

    async updateById(id, updateData) {
        return Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteById(id) {
        return Product.findByIdAndDelete(id);
    }

    async insertMany(products) {
        return Product.insertMany(products);
    }
}

module.exports = new ProductDAO();

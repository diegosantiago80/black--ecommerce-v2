const Cart = require('../models/cart.model');

class CartDAO {
    async findAll() {
        return Cart.find().populate('products.product');
    }

    async findById(id) {
        return Cart.findById(id);
    }

    async findByIdPopulated(id) {
        return Cart.findById(id).populate('products.product');
    }

    async create() {
        return Cart.create({ products: [] });
    }

    async updateById(id, updateData) {
        return Cart.findByIdAndUpdate(id, updateData, { new: true });
    }

    async save(cart) {
        return cart.save();
    }

    async deleteById(id) {
        return Cart.findByIdAndDelete(id);
    }
}

module.exports = new CartDAO();

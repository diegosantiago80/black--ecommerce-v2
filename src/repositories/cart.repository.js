const cartDAO = require('../dao/cart.dao');

class CartRepository {
    async getAll() {
        return cartDAO.findAll();
    }

    async getById(id) {
        return cartDAO.findById(id);
    }

    async getByIdPopulated(id) {
        return cartDAO.findByIdPopulated(id);
    }

    async create() {
        return cartDAO.create();
    }

    async update(id, updateData) {
        return cartDAO.updateById(id, updateData);
    }

    async save(cart) {
        return cartDAO.save(cart);
    }

    async delete(id) {
        return cartDAO.deleteById(id);
    }
}

module.exports = new CartRepository();

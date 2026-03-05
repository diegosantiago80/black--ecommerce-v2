const userDAO = require('../dao/user.dao');

class UserRepository {
    async getAll() {
        return userDAO.findAll();
    }

    async getById(id) {
        return userDAO.findById(id);
    }

    async getByEmail(email) {
        return userDAO.findByEmail(email);
    }

    async create(userData) {
        return userDAO.create(userData);
    }

    async update(id, updateData) {
        return userDAO.updateById(id, updateData);
    }

    async delete(id) {
        return userDAO.deleteById(id);
    }
}

module.exports = new UserRepository();

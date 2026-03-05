const User = require('../models/user.model');

class UserDAO {
    async findAll() {
        return User.find();
    }

    async findById(id) {
        return User.findById(id);
    }

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async create(userData) {
        return User.create(userData);
    }

    async updateById(id, updateData) {
        return User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteById(id) {
        return User.findByIdAndDelete(id);
    }
}

module.exports = new UserDAO();

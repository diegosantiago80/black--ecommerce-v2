const ticketDAO = require('../dao/ticket.dao');

class TicketRepository {
    async getAll() {
        return ticketDAO.findAll();
    }

    async getById(id) {
        return ticketDAO.findById(id);
    }

    async getByCode(code) {
        return ticketDAO.findByCode(code);
    }

    async create(ticketData) {
        return ticketDAO.create(ticketData);
    }
}

module.exports = new TicketRepository();

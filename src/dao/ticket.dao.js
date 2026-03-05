const Ticket = require('../models/ticket.model');

class TicketDAO {
    async findAll() {
        return Ticket.find();
    }

    async findById(id) {
        return Ticket.findById(id);
    }

    async findByCode(code) {
        return Ticket.findOne({ code });
    }

    async create(ticketData) {
        return Ticket.create(ticketData);
    }
}

module.exports = new TicketDAO();

import Ticket from '../models/ticket.model.js';

class TicketService {

  async createTicket(purchaserEmail, totalAmount) {
    try {
      const newTicket = new Ticket({
        purchaser: purchaserEmail,
        amount: totalAmount,
      });
      const savedTicket = await newTicket.save();
      return savedTicket;
    } catch (error) {
      console.error("Failed to create ticket", error);
      throw error;
    }
  }

  async getAllTickets() {
    return Ticket.find();
  }

  async getTicketByCode(ticketCode) {
    return Ticket.findOne({ code: ticketCode });
  }
}

export default new TicketService();

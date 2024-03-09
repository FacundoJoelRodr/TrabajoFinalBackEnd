import ticketService from '../service/tickets.service.js';


export default class TicketsController {

  static async get() {
    return await ticketService.get();
  }

  static async create( body) {
    return await ticketService.create(body);
  }

  static async getById(tid) {
    const ticket = await ticketService.getById(tid);
    
    return ticket;
}

  static async deleteById(tid) {
    return await ticketService.deleteById(tid);
  }

  static async generateTicket(cid) {
    try {
      return await ticketService.generateTicket(cid);
    } catch (error) {
      console.error('Error al generar tickets:', error);
      throw new Error('Error al generar el ticket del carrito');
    }
  }



}

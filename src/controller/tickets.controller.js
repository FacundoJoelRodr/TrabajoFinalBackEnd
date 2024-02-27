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

  


}

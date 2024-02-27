import TicketsManager from "../dao/ticketsManagerMongo.js";

export default class ticketService {
  static async get() {
    return await TicketsManager.get();
  }

  static async create( body) {
    return await TicketsManager.create(body);
  }

  static async getById(tid) {
    const ticket = await TicketsManager.getById(tid);
    return ticket;
  }

  static async deleteById(tid) {
    const ticketDelete = await TicketsManager.deleteById(tid);

    return ticketDelete;
  }
}

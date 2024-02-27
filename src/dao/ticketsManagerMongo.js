import { Exception, NotFoundException } from "../utils.js";
import ticketSchema from "../models/tickets.model.js";

export default class TicketsManager {
  static get(query = {}) {
    const criteria = {};
    if (!criteria) {
      throw new NotFoundException("Not Found");
    }
    return ticketSchema.find(criteria);
  }

  static async create(body) {

    return await ticketSchema.create(body);

  }

  static async getById(tid) {
    const ticket = await ticketSchema.findById(tid)
    if (!ticket) {
      throw new NotFoundException('Not Found');
    }
    return ticket;
  }      

  static async deleteById(tid) {
    const ticket = await ticketSchema.findById(tid);
  
    if (!ticket) {
      throw new NotFoundException('Not Found');
    }
    const criteria = { _id: tid };
    
    return await ticketSchema.deleteOne(criteria);
  }

  
}

import { Schema, model } from "mongoose";
import generateTicketCode from "../../../utils/generateTicket.js";

const TicketsSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: () => uuidv4(),
  },
  purchase_datetime: {
    type: Date,
    default: generateTicketCode(),
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const Ticket = model("ticket", TicketsSchema);

export default Ticket;

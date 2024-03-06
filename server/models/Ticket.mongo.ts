const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Ticket = mongoose.models.ticket || mongoose.model("ticket", ticketSchema);

export default Ticket;

const mongoose = require("mongoose");

const cryptoSchema = mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["buy", "sell"],
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    quoteTotal: {
      type: Number,
      required: true
    },
    baseCoin: {
      type: String,
      required: true
    },
    quoteCoin: {
      type: String,
      required: true
    },
    pair: {
      type: String,
      required: true
    },
    interval: {
      type: Number,
      required: true
    },
    leverage: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true,
      ref: "user"
    },
    status: {
      type: String,
      enum: ["open", "pending", "closed"],
      default: "open"
    },
    exitQuotePrice: {
      type: Number
    },
    closedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Crypto = mongoose.models.crypto || mongoose.model("crypto", cryptoSchema);
export default Crypto;

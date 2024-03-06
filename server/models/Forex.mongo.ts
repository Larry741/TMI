const mongoose = require("mongoose");

const forexSchema = mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["buy", "sell"],
      required: true
    },
    basePositionAmt: {
      type: Number,
      required: true
    },
    userTradeAmt: {
      type: Number,
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
    entryExRate: {
      type: Number,
      required: true
    },
    exitExRate: {
      type: Number
    },
    tradeCurrency: {
      type: String,
      required: true
    },
    baseCurrency: {
      type: String,
      required: true
    },
    quoteCurrency: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["open", "pending", "closed"],
      default: "open"
    },
    closedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Forex = mongoose.models.forex || mongoose.model("forex", forexSchema);
export default Forex;

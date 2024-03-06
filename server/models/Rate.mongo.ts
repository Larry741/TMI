const mongoose = require("mongoose");

const ratesSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    BTC: {
      type: Number,
      required: true
    },
    ETH: {
      type: Number,
      required: true
    },
    GOLD: {
      type: Number,
      required: true
    },
    SILVER: {
      type: Number,
      required: true
    },
    OIL: {
      type: Number,
      required: true
    },
    EUR: {
      type: Number,
      required: true
    },
    CAD: {
      type: Number,
      required: true
    },
    GBP: {
      type: Number,
      required: true
    },
    USD: {
      type: Number,
      required: true,
      default: 1
    },
    USDT: {
      type: Number,
      required: true,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

const Rates = mongoose.models.rates || mongoose.model("rates", ratesSchema);
export default Rates;

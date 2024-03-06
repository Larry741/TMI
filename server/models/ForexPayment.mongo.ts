const mongoose = require("mongoose");

const forexPaymentSchema = mongoose.Schema(
  {
    userTradeAmt: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true,
      ref: "user"
    },
    profit: {
      type: Number,
      default: 0
    },
    tradeId: {
      type: String,
      required: true,
      ref: "forex"
    }
  },
  {
    timestamps: true
  }
);

const ForexPayment =
  mongoose.models.forexPayment ||
  mongoose.model("forexPayment", forexPaymentSchema);
export default ForexPayment;

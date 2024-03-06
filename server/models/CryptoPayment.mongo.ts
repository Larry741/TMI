const mongoose = require("mongoose");

const CryptoPaymentSchema = mongoose.Schema(
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
      ref: "crypto"
    }
  },
  {
    timestamps: true
  }
);

const CryptoPayment =
  mongoose.models.cryptoPayment ||
  mongoose.model("cryptoPayment", CryptoPaymentSchema);
export default CryptoPayment;

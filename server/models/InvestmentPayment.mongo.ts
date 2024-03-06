const mongoose = require("mongoose");

const investmentPaymentSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true,
      ref: "user",
      unique: true
    },
    profit: {
      type: Number,
      default: 0
    },
    InvestmentId: {
      type: String,
      required: true,
      ref: "investment"
    }
  },
  {
    timestamps: true
  }
);

const InvestmentPayment =
  mongoose.models.investmentPayment ||
  mongoose.model("investmentPayment", investmentPaymentSchema);
export default InvestmentPayment;

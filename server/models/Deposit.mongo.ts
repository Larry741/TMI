const mongoose = require("mongoose");

const DepositSchema = mongoose.Schema(
  {
    detail: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "successfull", "failed"],
      required: true
    },
    amount: { type: Number, required: true },
    method: {
      type: String,
      required: true,
      enum: ["fiat", "crypto"]
    },
    channel: {
      type: String,
      required: true,
      enum: ["bank", "paypal", "BTC", "ETH", "USDT"]
    },
    userId: {
      type: String,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const Deposit =
  mongoose.models.deposit || mongoose.model("deposit", DepositSchema);
export default Deposit;

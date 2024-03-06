const mongoose = require("mongoose");

const withdrawalSchema = mongoose.Schema(
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
    currency: {
      type: String,
      required: true,
      enum: ["fiat", "crypto"]
    },
    channel: { type: String, enum: ["BTC", "USDT", "ETH"] },
    address: { type: String, require: true },
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

const Withdrawal =
  mongoose.models.withdrawal || mongoose.model("withdrawal", withdrawalSchema);
export default Withdrawal;

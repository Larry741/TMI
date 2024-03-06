const mongoose = require("mongoose");

const commoditySchema = mongoose.Schema(
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
    tradeTotal: {
      type: Number,
      required: true
    },
    commodity: {
      type: String,
      required: true
    },
    tradeCurrency: {
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
    tradeWeight: {
      type: String,
      required: true,
      enum: ["oz", "gm", "barrels", "lt"]
    },
    closedAt: {
      type: Date
    },
    commodityType: {
      type: String,
      enum: ["bmt"]
    }
  },
  {
    timestamps: true
  }
);

const Commodity =
  mongoose.models.commodity || mongoose.model("commodity", commoditySchema);
export default Commodity;

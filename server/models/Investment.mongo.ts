const mongoose = require("mongoose");

const investmentSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true,
      ref: "user"
    },
    type: {
      type: String,
      enum: ["silver", "gold", "diamond", "platinum"]
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active"
    },
    level: {
      type: Number
    },
    profits: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Investment =
  mongoose.models.investment || mongoose.model("investment", investmentSchema);
export default Investment;

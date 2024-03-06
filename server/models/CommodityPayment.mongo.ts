const mongoose = require("mongoose");

const CommodityPaymentSchema = mongoose.Schema(
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
      ref: "commodity"
    }
  },
  {
    timestamps: true
  }
);

const CommodityPayment =
  mongoose.models.commodityPayment ||
  mongoose.model("commodityPayment", CommodityPaymentSchema);
export default CommodityPayment;

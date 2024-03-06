const mongoose = require("mongoose");

const AutoTopUpSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    documentType: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const AutoTopUp =
  mongoose.models.autoTopUp || mongoose.model("autoTopUp", AutoTopUpSchema);

export default AutoTopUp;

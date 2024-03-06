const mongoose = require("mongoose");

const kyc = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    documentType: {
      type: String,
      required: true
    },
    frontImg: {
      type: String,
      required: true
    },
    backImg: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const KYC = mongoose.models.kyc || mongoose.model("kyc", kyc);

export default KYC;

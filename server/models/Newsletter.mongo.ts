const mongoose = require("mongoose");

const newsletter = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

const Newsletter =
  mongoose.models.newsletter || mongoose.model("newsletter", newsletter);

export default Newsletter;

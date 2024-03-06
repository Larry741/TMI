const mongoose = require("mongoose");

const ActivitySchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    activity: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Activity =
  mongoose.models.activities || mongoose.model("activities", ActivitySchema);
export default Activity;

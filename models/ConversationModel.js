const mongoose = require("mongoose");

const ConvSchema = new mongoose.Schema(
  {
    Users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    lastMsg: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConvSchema);

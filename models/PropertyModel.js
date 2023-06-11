const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    location: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bedroom: {
      type: Number,
      required: true,
    },
    bathroom: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: false,
    },
    attachment: {
      type: Array,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);

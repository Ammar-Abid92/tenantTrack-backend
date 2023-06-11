const mongoose = require("mongoose");

const RentalTrackingSchema = new mongoose.Schema(
  {
    propertyTenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyTenant'
    },
    status: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RentalTracking", RentalTrackingSchema);

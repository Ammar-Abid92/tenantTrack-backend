const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyTenant'
    },
    landlord_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyLandlord'
    },
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    status: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);

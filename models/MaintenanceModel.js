const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    propertyid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },

    username: {
      type: mongoose.Schema.Types.String,
      ref: 'Property'
    },


    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
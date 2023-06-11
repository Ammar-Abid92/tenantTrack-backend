const mongoose = require("mongoose");
const validator = require("validator/lib/isEmail");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      validate: [ validator, 'Invalid email' ]
    },
    usertype: {
      type: String,
      enum: ['landlord','tenant'],
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    otp: {
      type: Number,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

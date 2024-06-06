const mongoose = require("mongoose");

const schemaType = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    image: {
      type: String,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
    },

    postalCode: {
      type: Number,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
    },

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    verifyToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userInfoModel =
  mongoose.models?.userInfoData || mongoose.model("userInfoData", schemaType);
module.exports = userInfoModel;

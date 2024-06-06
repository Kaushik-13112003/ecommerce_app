const mongoose = require("mongoose");

const schemaType = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },

    token: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const forgotPasswordModel =
  mongoose.models?.forgotPasswordData ||
  mongoose.model("forgotPasswordData", schemaType);
module.exports = forgotPasswordModel;

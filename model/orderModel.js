const mongoose = require("mongoose");

const schemaType = new mongoose.Schema(
  {
    line_items: {
      type: Object,
    },

    name: {
      type: String,
    },

    city: {
      type: String,
    },

    email: {
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

    paid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "In Transit",
        "Out for Delivery",
        "Delivered",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const orderModel =
  mongoose.models?.orderData || mongoose.model("orderData", schemaType);
module.exports = orderModel;

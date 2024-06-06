const mongoose = require("mongoose");

const schemaType = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    category: {
      type: String,
    },

    des: {
      type: String,
    },

    price: {
      type: Number,
    },

    images: {
      type: [String],
    },

    properties: [
      {
        type: Object,
      },
    ],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviewData" }],

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const productModel =
  mongoose.models?.productData || mongoose.model("productData", schemaType);
module.exports = productModel;

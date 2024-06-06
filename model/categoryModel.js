const mongoose = require("mongoose");

const schemaType = new mongoose.Schema(
  {
    category: {
      type: String,
    },

    // parentCategory: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "categoryData",
    // },
  },
  {
    timestamps: true,
  }
);

const categoryModel =
  mongoose.models?.categoryData || mongoose.model("categoryData", schemaType);
module.exports = categoryModel;

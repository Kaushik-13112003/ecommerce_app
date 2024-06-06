import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productData",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
  },

  {
    timestamps: true,
  }
);

const reviewModel =
  mongoose.models.reviewData || mongoose.model("reviewData", reviewSchema);
export default reviewModel;

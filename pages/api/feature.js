import { connectDB } from "@/lib/db";
import productModel from "@/model/productModel";

export default async function categoryRoutes(req, res) {
  await connectDB();

  let { method } = req;

  if (method === "PUT") {
    let { id } = req.body;
    await productModel.updateMany(
      { isFeatured: true },
      { $set: { isFeatured: false } }
    );

    if (!id) return;

    let updateSingleProducts = await productModel.findByIdAndUpdate(
      { _id: id },
      { isFeatured: true },
      { new: true }
    );

    return res.json(updateSingleProducts);
  }

  if (method === "GET") {
    let findProduct = await productModel.findOne({ isFeatured: true });
    return res.json(findProduct);
  }
}

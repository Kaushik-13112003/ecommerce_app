import { connectDB } from "@/lib/db";
import categoryModel from "@/model/categoryModel";
// import { getServerSession } from "next-auth";
// import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function categoryRoutes(req, res) {
  await connectDB();
  // await isAdminRequest(req, res);
  let { method } = req;

  if (method === "POST") {
    let { category, parentCategory, properties } = req.body;

    let newCategory = await categoryModel.create({
      category,
      // parentCategory: parentCategory || undefined,
      properties,
    });
    res.json("ok");
  }

  if (method === "GET") {
    if (req.query?.id) {
      let findCategory = await categoryModel.findById({ _id: req.query?.id });
      return res.json(findCategory);
    }

    let allCategory = await categoryModel.find().sort({ createdAt: -1 });
    return res.json(allCategory);
  }

  if (method === "PUT") {
    // let { id } = req.query?.id;
    let { id, category, parentCategory, properties } = req.body;

    if (!id) {
      return;
    }

    if (id) {
      let updateCategory = await categoryModel.findByIdAndUpdate(
        { _id: id },
        {
          id,
          category,
          // parentCategory: parentCategory || undefined,
          properties,
        },
        { new: true }
      );
      return res.json(updateCategory);
    }
  }

  if (method === "DELETE") {
    let { id } = req.body;
    let deleteCategory = await categoryModel.findByIdAndDelete({ _id: id });
    return res.json("ok");
  }
}

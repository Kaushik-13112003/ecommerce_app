import { connectDB } from "@/lib/db";
import productModel from "@/model/productModel";
// import { NextResponse } from "next/server";
// import { isAdminRequest } from "./auth/[...nextauth]";

export default async function POST(req, res) {
  // const { name, des, price } = await req.json();
  let { method } = req;
  // await isAdminRequest(req, res);
  await connectDB();

  try {
    if (method === "POST") {
      let { name, des, price, images, category, properties } = req.body;

      let newProduct = await productModel.create({
        name,
        price,
        des,
        images,
        category,
        properties: properties || [],
      });
      return res.json(newProduct);
    }

    if (method === "GET") {
      if (req.query?.id) {
        let findProduct = await productModel.findOne({ _id: req.query?.id });
        return res.json(findProduct);
      }

      let allProducts = await productModel.find().sort({ createdAt: -1 });
      return res.json(allProducts);
    }

    if (method === "PUT") {
      // let { id } = req.query?.id;
      let { name, price, des, id, images, category, properties } = req.body;

      if (!id || id == undefined) {
        return;
      }

      if (id) {
        let updateProduct = await productModel.findByIdAndUpdate(
          { _id: id },
          { name, price, des, images, category, properties: properties || [] },
          { new: true }
        );
        return res.json(updateProduct);
      }
    }

    if (method === "DELETE") {
      let { id } = req.body;

      if (!id || id === undefined) {
        return;
      }
      let deleteProduct = await productModel.findByIdAndDelete({ _id: id });
      return res.json("ok");
    }
  } catch (err) {
    console.log(err);
  }
}

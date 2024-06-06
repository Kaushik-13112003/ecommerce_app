import { connectDB } from "@/lib/db";
import orderModel from "@/model/orderModel";

export default async function orderFunction(req, res) {
  let { method } = req;
  await connectDB();

  if (method === "GET") {
    let allOrders = await orderModel.find().sort({ createdAt: -1 });
    return res.json(allOrders);
  }

  if (method === "PUT") {
    let { id, status } = req.body;
    let updateOrder = await orderModel.findByIdAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    );

    return res.json(updateOrder);
  }
}

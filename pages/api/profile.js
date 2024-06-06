import { connectDB } from "@/lib/db";
import userInfoModel from "@/model/userInfoModel";

export default async function profileHandler(req, res) {
  let { method } = req;

  await connectDB();
  //   if (method === "POST") {
  //     let {id} = req.params;

  //     let findUser = await userInfoModel.findById({ _id: id.toString() });

  //   }

  if (method === "POST") {
    let { id } = req.body;
    // console.log(id);
    if (!id) {
      return;
    }

    let findUser = await userInfoModel.findById({ _id: id.toString() });

    return res.json(findUser);
  }

  if (method === "PUT") {
    let { id, name, image, city, postalCode, address, state, country, email } =
      req.body;

    //isExist
    const isExist = await userInfoModel.findOne({ email: email });

    if (!isExist || !id) {
      return res.status(400).json({ message: "User not found" });
    }

    let updateUser = await userInfoModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    return res.json(updateUser);
  }
}

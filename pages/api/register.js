import { connectDB } from "@/lib/db";
import userInfoModel from "@/model/userInfoModel";
const bcrypt = require("bcrypt");

export default async function POST(req, res) {
  let { method } = req;
  await connectDB();

  try {
    if (method === "POST") {
      let {
        name,
        email,
        password,
        image,
        city,
        postalCode,
        address,
        state,
        country,
        role,
      } = req.body;

      //isExist
      const isExist = await userInfoModel.findOne({ email: email });

      if (isExist) {
        return res.status(400).json({ msg: "E-Mail already Exists" });
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email) {
          if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Invalid E-Mail Format" });
          } else {
            password = await bcrypt.hash(password, 10);

            let newUser = await userInfoModel.create({
              name,
              email,
              password,
              image,
              role,
              city,
              postalCode,
              address,
              state,
              country,
            });
            return res.json(newUser);
          }
        }
      }
    }

    if (method === "GET") {
      if (req.query?.id) {
        let finduser = await userInfoModel.findOne({ _id: req.query?.id });
        return res.json(finduser);
      }
    }

    if (method === "PUT") {
      // let { id } = req.query?.id;
      let {
        name,
        email,
        password,
        image,
        city,
        postalCode,
        address,
        state,
        country,
      } = req.body;

      if (!id || id == undefined) {
        return;
      }

      if (id) {
        let updateProfile = await userInfoModel.findByIdAndUpdate(
          { _id: id },
          {
            name,
            email,
            password,
            image,
            city,
            postalCode,
            address,
            state,
            country,
          },
          { new: true }
        );
        return res.json(updateProfile);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

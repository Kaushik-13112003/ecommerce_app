import { connectDB } from "@/lib/db";
import userInfoModel from "@/model/userInfoModel";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export default async function POST(req, res) {
  let { method } = req;

  await connectDB();
  if (method === "POST") {
    try {
      let { email, password, role } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email) {
        if (!emailRegex.test(email)) {
          return res.status(400).json({ msg: "Invalid E-Mail Format" });
        }
      }
      //verify email & password
      const verify = await userInfoModel.findOne({ email: email });

      if (!verify) {
        return res.status(400).json({ msg: "User not found" });
      }

      if (verify.role !== role) {
        return res.status(400).json({ msg: " wrong credentials" });
      }

      if (password && email && role && verify) {
        if (verify && verify.role === role) {
          //decode password
          let isMatch = await bcrypt.compare(password, verify.password);
          const token = await jwt.sign({ _id: verify._id }, process.env.TOKEN, {
            expiresIn: "7d",
          });
          console.log(token);
          if (isMatch) {
            return res.status(200).json({
              msg: "Login Successfully",
              loginData: verify?._id,
              token: token,
              role: verify?.role,
            });
          } else {
            return res.status(400).json({ msg: "Wrong Credentials" });
          }
        } else {
          return res.status(400).json({ msg: "Wrong Credentials" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

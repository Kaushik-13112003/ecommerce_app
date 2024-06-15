import nodemailer from "nodemailer";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
import { ContactPageSharp } from "@mui/icons-material";
import { connectDB } from "@/lib/db";
import userInfoModel from "@/model/userInfoModel";

export default async function forgotPassword(req, res) {
  let { method } = req;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    logger: true,
    secureConnection: false,
    auth: {
      user: "developerbuddy1311@gmail.com",
      pass: "djuczkfoyyvvsnul",
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  await connectDB();
  if (method === "POST") {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ msg: "Complete the fields" });
    }

    const isExist = await userInfoModel.findOne({ email: email });

    if (!isExist || isExist.role !== role) {
      return res.status(400).json({ msg: "User not found" });
    }

    //generate token
    const token = jwt.sign({ _id: isExist?._id }, process.env.TOKEN, {
      expiresIn: "120s",
    });
    console.log(token);

    const setUserToken = await userInfoModel.findByIdAndUpdate(
      { _id: isExist?._id },
      { verifyToken: token },
      { new: true }
    );
    console.log(setUserToken, "set");

    if (setUserToken) {
      const mailOptions = {
        from: "developerbuddy1311@gmail.com",
        to: email,
        subject: "Reset Your Password on buyNow.com",
        html: `
         <p>Dear ${setUserToken?.name},</p>
         <p>We received a request to reset your password for your buyNow.com account. If you did not request a password reset, please ignore this email. Your password will not change.</p>
         <p>To reset your password, please click the link below:</p>
         <a href=http://localhost:3000/reset-password/${setUserToken?._id}/${setUserToken?.verifyToken}> Click here to reset password </a>
         <p>For your security, this link will expire after one time access. If you need a new link, you can request another password reset on the buyNow.com website.</p>
         <p>If you have any issues or did not request this change, please contact our support team at support@buyNow.com.</p>
         <p>Best regards,</p>
         <p>The buyNow.com Team</p>
         <hr>
         <p>buyNow.com<br>Your go-to platform for the best deals online.</p>
         `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          return res.status(401).json({ msg: "email not sent !! try again" });
        } else {
          return res.status(200).json({ msg: "email sent" });
        }
      });
    }

    // if (token) {
    //   let addTokenToUserData = await userInfoModel.findByIdAndUpdate(
    //     { _id: setUserToken?._id },
    //     { verifyToken: token },
    //     { new: true }
    //   );

    //   if (addTokenToUserData) {
    //     const mailOptions = {
    //       from: "developerbuddy1311@gmail.com", // Use your verified SendGrid sender email
    //       to: email,
    //       subject: "Reset Your Password on buyNow.com",
    //       html: `
    //      <p>Dear ${isExist?.name},</p>
    //      <p>We received a request to reset your password for your buyNow.com account. If you did not request a password reset, please ignore this email. Your password will not change.</p>
    //      <p>To reset your password, please click the link below:</p>
    //      <a href=http://localhost:3000/reset-password/${isExist?._id}/${addTokenToUserData?.verifyToken}"> Click here to reset password </a>
    //      <p>For your security, this link will expire after one time access. If you need a new link, you can request another password reset on the buyNow.com website.</p>
    //      <p>If you have any issues or did not request this change, please contact our support team at support@buyNow.com.</p>
    //      <p>Best regards,</p>
    //      <p>The buyNow.com Team</p>
    //      <hr>
    //      <p>buyNow.com<br>Your go-to platform for the best deals online.</p>
    //      `,
    //     };

    //     transporter.sendMail(mailOptions, (err, info) => {
    //       if (err) {
    //         console.log(err);
    //         return res.status(401).json({ msg: "email not sent !! try again" });
    //       } else {
    //         return res.status(200).json({ msg: "email sent" });
    //       }
    //     });
    //   }

    //   return res.json("ok");
    // }

    return res.json("ok");
  }

  if (method === "PUT") {
    let { password, id, token } = req.body;
    // console.log(password, id, token);

    try {
      const validUser = await userInfoModel.findOne({
        _id: id,
        verifyToken: token,
      });
      console.log(validUser, " ----");
      // return res.json(validUser);

      if (validUser == null) {
        return res.json({ expire: "token expired" });
      }

      const verifyToken = jwt.verify(token, process.env.TOKEN);
      4;

      if (verifyToken && validUser) {
        // console.log(verifyToken);

        const newPassword = await bcrypt.hash(password, 10);
        // console.log(newPassword + " new");
        const updatePassword = await userInfoModel.findByIdAndUpdate(
          { _id: id },
          { password: newPassword }
        );

        if (updatePassword) {
          const updatePassword = await userInfoModel.findByIdAndUpdate(
            { _id: id },
            { verifyToken: null }
          );
          return res.json("password updated successfully !! ");
        }
      }
    } catch (err) {
      console.log(err);
    }

    return res.json("ok");
  }
}

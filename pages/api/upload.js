import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";
import fs from "fs";
import mime from "mime-types";
import { connectDB } from "@/lib/db";
// import { isAdminRequest } from "./auth/[...nextauth]";

export default async function POST(req, res) {
  // await isAdminRequest(req, res);
  await connectDB();
  try {
    let form = new multiparty.Form();

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);

        resolve({ fields, files });
      });
    });
    console.log(files);

    let links = [];

    const client = new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
    });

    for (const file of files.file) {
      let extension = file.originalFilename.split(".").pop();

      const newFileName = uniqid() + "." + extension;

      await client.send(
        new PutObjectCommand({
          Bucket: "nextjs13-ecommerce-app",
          Key: newFileName,
          Body: fs.readFileSync(file.path),
          ACL: "public-read",
          ContentType: mime.lookup(file.path),
        })
      );

      const link = `https://nextjs13-ecommerce-app.s3.amazonaws.com/${newFileName}`;
      links.push(link);
    }

    return res.status(200).json({ links: links });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export const config = {
  api: { bodyParser: false },
};
